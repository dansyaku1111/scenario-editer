import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        page.on("console", lambda msg: print(f"PAGE LOG: {msg.text}"))
        await page.goto("http://localhost:5173")

        try:
            # Wait for the editor to load
            await expect(page.locator(".rete-editor")).to_be_visible(timeout=10000)
        except Exception as e:
            print(f"Error: {e}")
            await page.screenshot(path="jules-scratch/verification/error.png")

        # Add a start node
        await page.get_by_role("button", name="スタートノード追加").click()
        await asyncio.sleep(0.5)

        # Take a screenshot with the grid
        await page.screenshot(path="jules-scratch/verification/grid_visible.png")

        # Drag the node
        node = page.locator(".start-node")
        await node.drag_to(page.locator(".rete-editor"), target_position={"x": 200, "y": 200})
        await asyncio.sleep(0.5)

        # Take a screenshot of the snapped node
        await page.screenshot(path="jules-scratch/verification/node_snapped.png")

        # Disable the grid
        await page.get_by_label("グリッド表示").uncheck()
        await asyncio.sleep(0.5)

        # Take a screenshot without the grid
        await page.screenshot(path="jules-scratch/verification/grid_disabled.png")

        # Change grid size
        await page.get_by_label("グリッドサイズ:").select_option("32px")
        await page.get_by_label("グリッド表示").check()
        await asyncio.sleep(0.5)

        # Take a screenshot with the new grid size
        await page.screenshot(path="jules-scratch/verification/grid_size_32.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
