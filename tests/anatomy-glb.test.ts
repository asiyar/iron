import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const modelPath = path.resolve(__dirname, "../assets/models/ironpulse-muscles.glb");

describe.skipIf(!fs.existsSync(modelPath))("IronPulse anatomy GLB", () => {
  it("is a valid GLB container with named selectable muscle meshes", () => {
    const binary = fs.readFileSync(modelPath);
    const magic = binary.readUInt32LE(0);
    const length = binary.readUInt32LE(8);
    const jsonLength = binary.readUInt32LE(12);
    const document = JSON.parse(binary.subarray(20, 20 + jsonLength).toString("utf8").trim());
    expect(magic).toBe(0x46546c67);
    expect(length).toBe(binary.length);
    expect(document.meshes).toHaveLength(21);
    expect(document.nodes.map((node: { name: string }) => node.name)).toEqual(expect.arrayContaining(["Chest_L", "Back", "Quadriceps_L", "Calf_R"]));
  });
});
