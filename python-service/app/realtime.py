import json
import asyncio
import logging
from typing import Set
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse

logger = logging.getLogger("aegis-realtime")

class EventPublisher:
    def __init__(self):
        self.listeners: Set[asyncio.Queue] = set()

    def subscribe(self) -> asyncio.Queue:
        queue = asyncio.Queue()
        self.listeners.add(queue)
        logger.info(f"New client subscribed to realtime events. Total listeners: {len(self.listeners)}")
        return queue

    def unsubscribe(self, queue: asyncio.Queue):
        self.listeners.discard(queue)
        logger.info(f"Client unsubscribed from realtime events. Total listeners: {len(self.listeners)}")

    async def publish(self, event_type: str, data: dict):
        payload = {"event_type": event_type, "data": data}
        logger.info(f"Publishing event '{event_type}' to {len(self.listeners)} listeners.")
        for queue in list(self.listeners):
            try:
                await queue.put(payload)
            except Exception as e:
                logger.error(f"Failed to push event to listener queue: {str(e)}")

from pydantic import BaseModel

class PublishEventRequest(BaseModel):
    event_type: str
    data: dict

event_publisher = EventPublisher()
router = APIRouter()

@router.post("/publish")
async def publish_realtime_event(payload: PublishEventRequest):
    await event_publisher.publish(payload.event_type, payload.data)
    return {"status": "published"}

@router.get("/events")
async def stream_events(request: Request):
    queue = event_publisher.subscribe()
    
    async def event_generator():
        try:
            # Send initial connection success event
            yield "event: connection\ndata: {\"status\": \"connected\"}\n\n"
            
            while True:
                if await request.is_disconnected():
                    break
                try:
                    event = await asyncio.wait_for(queue.get(), timeout=2.0)
                    yield f"event: {event['event_type']}\ndata: {json.dumps(event['data'])}\n\n"
                except asyncio.TimeoutError:
                    yield "event: ping\ndata: keep-alive\n\n"
        except Exception as e:
            logger.error(f"Error in realtime event stream generator: {str(e)}")
        finally:
            event_publisher.unsubscribe(queue)

    return StreamingResponse(event_generator(), media_type="text/event-stream")
