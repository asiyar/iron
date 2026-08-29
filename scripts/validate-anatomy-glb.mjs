import fs from "node:fs";

const file = new URL("../assets/models/ironpulse-muscles.glb", import.meta.url);
const binary = fs.readFileSync(file);
const magic = binary.readUInt32LE(0).toString(16);
const declaredLength = binary.readUInt32LE(8);
const jsonLength = binary.readUInt32LE(12);
const json = binary.subarray(20, 20 + jsonLength).toString("utf8").trim();
const document = JSON.parse(json);
const valid = magic === "46546c67" && declaredLength === binary.length && document.meshes.length === 21 && document.nodes.some((node) => node.name === "Chest_L");
if (!valid) throw new Error("GLB kapsayıcısı veya seçilebilir kas düğümleri geçersiz.");
console.log(JSON.stringify({ bytes: binary.length, meshes: document.meshes.length, namedMuscle: true }));
