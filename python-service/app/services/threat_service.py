import uuid
from app.database import get_db_connection
from app.detection import detect_threat

def process_threat_log(source: str, ip: str, message: str) -> dict:
    # 1. Run detection
    result = detect_threat(message)
    detected = result["detected"]
    attack_type = result["attack_type"]
    severity = result["severity"]
    
    incident_created = False
    
    if detected:
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                # 2. Resolve organizationId from LogSource name
                cursor.execute('SELECT "organizationId" FROM "LogSource" WHERE "name" = %s LIMIT 1', (source,))
                row = cursor.fetchone()
                if row:
                    org_id = row[0]
                else:
                    # Fetch first organization
                    cursor.execute('SELECT "id" FROM "Organization" LIMIT 1')
                    org_row = cursor.fetchone()
                    if org_row:
                        org_id = org_row[0]
                        # Auto-create LogSource so it is registered in the B2B mapping
                        new_ls_id = str(uuid.uuid4())
                        new_api_key = f"ls_key_auto_{source}_{uuid.uuid4().hex[:6]}"
                        cursor.execute(
                            'INSERT INTO "LogSource" (id, "organizationId", name, "apiKey", "createdAt") VALUES (%s, %s, %s, %s, NOW())',
                            (new_ls_id, org_id, source, new_api_key)
                        )
                    else:
                        raise ValueError("No organization exists in the database. Please seed the database first.")
                
                # 3. Insert ThreatEvent
                threat_id = str(uuid.uuid4())
                cursor.execute(
                    'INSERT INTO "ThreatEvent" (id, "organizationId", "sourceIp", target, severity, description, "rawPayload", "createdAt") VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())',
                    (threat_id, org_id, ip, source, severity, attack_type, message)
                )
                
                # 4. Insert Incident if HIGH or CRITICAL
                if severity in ("HIGH", "CRITICAL"):
                    incident_id = str(uuid.uuid4())
                    title = f"Incident: {attack_type} target {source} severity {severity}"
                    cursor.execute(
                        'INSERT INTO "Incident" (id, "organizationId", title, status, "assignedTo", "createdAt", "updatedAt") VALUES (%s, %s, %s, %s, %s, NOW(), NOW())',
                        (incident_id, org_id, title, "open", "Unassigned")
                    )
                    incident_created = True
                
                conn.commit()
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()

    return {
        "detected": detected,
        "attack_type": attack_type,
        "severity": severity,
        "incident_created": incident_created
    }
