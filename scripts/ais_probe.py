#!/usr/bin/env python3
"""Private, read-only AISStream coverage probe. Never prints coordinates or secrets."""
import asyncio, json, os, sys
from datetime import datetime, timezone
import websockets

MMSI = "310869000"
URI = "wss://stream.aisstream.io/v0/stream"

async def main():
    key = os.environ.get("AISSTREAM_API_KEY", "").strip()
    if not key:
        print("NOT CONFIGURED: Add repository Actions secret AISSTREAM_API_KEY.")
        return 0
    count = 0
    confirmations = 0
    received = 0
    subscription = {
        "APIKey": key,
        "BoundingBoxes": [[[12, -91], [32, -64]]],
        "FiltersShipMMSI": [MMSI],
        "FilterMessageTypes": ["PositionReport"],
    }
    try:
        async with websockets.connect(URI, compression="deflate", open_timeout=12, max_size=2**20) as socket:
            await socket.send(json.dumps(subscription))
            async def receive():
                nonlocal count, confirmations, received
                async for raw in socket:
                    received += 1
                    event = json.loads(raw)
                    if event.get("MessageType") == "SubscriptionConfirmation":
                        confirmations += 1
                        print("AISStream subscription confirmation received.")
                    elif event.get("MessageType") == "PositionReport":
                        msg = event.get("Message", {}).get("PositionReport", {})
                        meta = event.get("MetaData", {})
                        if str(msg.get("UserID", meta.get("MMSI", ""))) != MMSI:
                            continue
                        count += 1
                        print("Matching vessel position report observed (coordinates withheld).")
            try:
                await asyncio.wait_for(receive(), timeout=45)
            except TimeoutError:
                pass
    except Exception as e:
        print("Stream could not complete:", type(e).__name__, str(e)[:160])
        return 1
    print(f"Probe finished: confirmations={confirmations}, matching_reports={count}, received_messages={received}.")
    print("No AIS position was published to the website. One short test cannot prove offshore coverage.")
    return 0

if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
