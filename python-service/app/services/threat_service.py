import uuid
from typing import Optional
from datetime import datetime
import os
import requests
from app.database import get_db_connection
from app.detection import detect_threat

def trigger_system_alerts(org_id: str, alert_type: str, message: str, cursor) -> None:
    # 1. Create In-App NotificationLog
    cursor.execute(
        'INSERT INTO "NotificationLog" (id, "organizationId", type, channel, message, status, read, "createdAt") '
        'VALUES (%s, %s, %s, %s, %s, %s, FALSE, NOW())',
        (str(uuid.uuid4()), org_id, alert_type, "in_app", message, "sent")
    )
    
    # 2. Create Email NotificationLog (Stub)
    cursor.execute(
        'INSERT INTO "NotificationLog" (id, "organizationId", type, channel, message, status, read, "createdAt") '
        'VALUES (%s, %s, %s, %s, %s, %s, FALSE, NOW())',
        (str(uuid.uuid4()), org_id, alert_type, "email", f"[EMAIL ALERT] {message}", "sent")
    )
    
    # 3. Create Slack NotificationLog (Webhook if configured)
    slack_webhook = os.getenv("SLACK_WEBHOOK_URL")
    slack_status = "sent"
    if slack_webhook:
        try:
            response = requests.post(slack_webhook, json={"text": f"🚨 *AEGIS SOC ALERT*: {message}"}, timeout=2.0)
            if response.status_code != 200:
                slack_status = "failed"
        except Exception:
            slack_status = "failed"
            
    cursor.execute(
        'INSERT INTO "NotificationLog" (id, "organizationId", type, channel, message, status, read, "createdAt") '
        'VALUES (%s, %s, %s, %s, %s, %s, FALSE, NOW())',
        (str(uuid.uuid4()), org_id, alert_type, "slack", f"[SLACK ALERT] {message}", slack_status)
    )

def _publish_event(event_type: str, data: dict):
    try:
        from app.realtime import event_publisher
        import asyncio
        loop = asyncio.get_event_loop()
        if loop.is_running():
            loop.create_task(event_publisher.publish(event_type, data))
        else:
            asyncio.run(event_publisher.publish(event_type, data))
    except Exception as e:
        print(f"Failed to publish realtime event {event_type}: {str(e)}")

def process_threat_log(source: str, ip: str, message: str, api_key: Optional[str] = None) -> dict:
    print("API KEY RECEIVED:", api_key)
    print("SOURCE RECEIVED:", source)
    # 1. Run detection
    result = detect_threat(message)
    detected = result["detected"]
    attack_type = result["attack_type"]
    severity = result["severity"]
    
    incident_created = False
    
    # If not detected, categorise as clean log
    if not detected:
        attack_type = "CLEAN"
        severity = "INFO"
        
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            org_id = None
            log_source_name = source

            # Step A: Resolve by API Key if provided
            if api_key:
                print("API KEY RECEIVED:", api_key)
                cursor.execute(
                    'SELECT "organizationId", "name" FROM "LogSource" WHERE "apiKey" = %s LIMIT 1',
                    (api_key,)
                )
                row = cursor.fetchone()

                print("LOOKUP RESULT:", row)

                if row:
                    org_id = row[0]
                    log_source_name = row[1]

            # If org_id is unresolved to enforce isolation
            if not org_id:
                raise ValueError("Unauthorized: Invalid log source API key mapping")

            # Ensure the resolved LogSource is registered under the correct organization, auto-create if missing
            cursor.execute(
                'SELECT "id" FROM "LogSource" WHERE "organizationId" = %s AND "name" = %s LIMIT 1', 
                (org_id, log_source_name)
            )
            ls_row = cursor.fetchone()
            if not ls_row:
                new_ls_id = str(uuid.uuid4())
                new_api_key = api_key if api_key else f"ls_key_auto_{log_source_name}_{uuid.uuid4().hex[:6]}"
                
                # Ensure API key uniqueness in database
                cursor.execute('SELECT "id" FROM "LogSource" WHERE "apiKey" = %s LIMIT 1', (new_api_key,))
                if cursor.fetchone():
                    new_api_key = f"ls_key_auto_{log_source_name}_{uuid.uuid4().hex[:6]}"

                cursor.execute(
                    'INSERT INTO "LogSource" (id, "organizationId", name, "apiKey", "createdAt") VALUES (%s, %s, %s, %s, NOW())',
                    (new_ls_id, org_id, log_source_name, new_api_key)
                )

            incident_id = None
            title = ""
            desc = ""
            if detected and severity in ("HIGH", "CRITICAL"):
                incident_id = str(uuid.uuid4())
                title = f"Incident: {attack_type} target {log_source_name} severity {severity}"
                desc = f"Auto-generated incident for detected {attack_type} threat against {log_source_name}."
                cursor.execute(
                    'INSERT INTO "Incident" (id, "organizationId", title, description, severity, status, "assignedTo", "createdAt", "updatedAt") VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), NOW())',
                    (incident_id, org_id, title, desc, severity, "open", "Unassigned")
                )
                
                # Create initial activity log entry for the incident
                activity_id = str(uuid.uuid4())
                cursor.execute(
                    'INSERT INTO "IncidentActivityLog" (id, "organizationId", "incidentId", "activityType", description, "createdAt") VALUES (%s, %s, %s, %s, %s, NOW())',
                    (activity_id, org_id, incident_id, "created", "Incident automatically created from threat event.")
                )
                
                # Trigger Slack/Email/In-App alerting center notifications
                trigger_system_alerts(org_id, "incident_created", title, cursor)
                incident_created = True

            # 3. Insert ThreatEvent under correct organizationId (linked to Incident if created)
            threat_id = str(uuid.uuid4())
            cursor.execute(
                'INSERT INTO "ThreatEvent" (id, "organizationId", "sourceIp", target, severity, description, "rawPayload", status, "assignedTo", "aiSummary", "incidentId", "createdAt") VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())',
                (threat_id, org_id, ip, log_source_name, severity, attack_type, message, "Clean" if not detected else "New", "Unassigned", None, incident_id)
            )
            
            # 3.5 Execute SOAR playbooks inside transaction
            threat_event_obj = {
                "id": threat_id,
                "organizationId": org_id,
                "sourceIp": ip,
                "target": log_source_name,
                "severity": severity,
                "description": attack_type,
                "rawPayload": message,
                "status": "Clean" if not detected else "New",
                "assignedTo": "Unassigned",
                "incidentId": incident_id
            }
            try:
                from app.services.automation_service import execute_playbooks
                execute_playbooks(threat_event_obj, cursor)
            except Exception as soar_err:
                print(f"SOAR execution failure: {str(soar_err)}")

            conn.commit()

            # 4. Stream real-time events upon successful commit
            threat_payload = {
                "id": threat_id,
                "organizationId": org_id,
                "sourceIp": ip,
                "target": log_source_name,
                "severity": threat_event_obj["severity"],
                "description": attack_type,
                "rawPayload": message,
                "status": "Clean" if not detected else "New",
                "assignedTo": "Unassigned",
                "incidentId": threat_event_obj["incidentId"],
                "createdAt": datetime.now().isoformat()
            }
            _publish_event("threat", threat_payload)

            # Check if incident was created heuristically or by SOAR playbook
            final_incident_created = incident_created or (threat_event_obj["incidentId"] is not None and incident_id is None)
            final_incident_id = threat_event_obj["incidentId"]

            if final_incident_created and final_incident_id:
                incident_payload = {
                    "id": final_incident_id,
                    "organizationId": org_id,
                    "title": title if title else f"SOAR: {attack_type} detection",
                    "description": desc if desc else "Incident created automatically.",
                    "severity": threat_event_obj["severity"],
                    "status": "open",
                    "assignedTo": "Unassigned",
                    "createdAt": datetime.now().isoformat(),
                    "updatedAt": datetime.now().isoformat()
                }
                _publish_event("incident", incident_payload)

    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

    return {
        "detected": detected,
        "attack_type": attack_type,
        "severity": threat_event_obj["severity"],
        "incident_created": incident_created or (threat_event_obj["incidentId"] is not None)
    }

