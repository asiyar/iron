import fs from "node:fs";
import path from "node:path";
import * as THREE from "three";

const outDir = path.resolve(process.cwd(), "assets/models");
fs.mkdirSync(outDir, { recursive: true });

const chunks = [];
const bufferViews = [];
const accessors = [];
const meshes = [];
const nodes = [];
const materials = [];
const materialIndex = new Map();

function pad4(buffer, fill = 0) {
  const padding = (4 - (buffer.length % 4)) % 4;
  return padding ? Buffer.concat([buffer, Buffer.alloc(padding, fill)]) : buffer;
}

function appendBuffer(buffer, target) {
  const aligned = pad4(buffer);
  const offset = chunks.reduce((total, chunk) => total + chunk.length, 0);
  chunks.push(aligned);
  bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: buffer.length, target });
  return bufferViews.length - 1;
}

function accessorForAttribute(attribute, target = 34962) {
  const componentType = attribute.array instanceof Float32Array ? 5126 : attribute.array instanceof Uint32Array ? 5125 : 5123;
  const view = appendBuffer(Buffer.from(attribute.array.buffer, attribute.array.byteOffset, attribute.array.byteLength), target);
  const type = attribute.itemSize === 3 ? "VEC3" : attribute.itemSize === 2 ? "VEC2" : "SCALAR";
  const values = [];
  for (let i = 0; i < attribute.count; i += 1) values.push(attribute.getX(i), ...(attribute.itemSize > 1 ? [attribute.getY(i)] : []), ...(attribute.itemSize > 2 ? [attribute.getZ(i)] : []));
  const min = Array.from({ length: attribute.itemSize }, (_, axis) => Math.min(...values.filter((_, index) => index % attribute.itemSize === axis)));
  const max = Array.from({ length: attribute.itemSize }, (_, axis) => Math.max(...values.filter((_, index) => index % attribute.itemSize === axis)));
  accessors.push({ bufferView: view, componentType, count: attribute.count, type, min, max });
  return accessors.length - 1;
}

function accessorForIndex(index) {
  const array = index.array instanceof Uint32Array ? index.array : new Uint16Array(index.array);
  const view = appendBuffer(Buffer.from(array.buffer, array.byteOffset, array.byteLength), 34963);
  accessors.push({ bufferView: view, componentType: array instanceof Uint32Array ? 5125 : 5123, count: array.length, type: "SCALAR", min: [Math.min(...array)], max: [Math.max(...array)] });
  return accessors.length - 1;
}

function material(color) {
  if (materialIndex.has(color)) return materialIndex.get(color);
  materials.push({ name: color, pbrMetallicRoughness: { baseColorFactor: new THREE.Color(color).toArray().concat([1]), metallicFactor: 0.08, roughnessFactor: 0.62 } });
  const index = materials.length - 1;
  materialIndex.set(color, index);
  return index;
}

function addPart(name, geometry, color, position, rotation = [0, 0, 0], scale = [1, 1, 1]) {
  geometry.computeVertexNormals();
  const attributes = { POSITION: accessorForAttribute(geometry.getAttribute("position")) };
  if (geometry.getAttribute("normal")) attributes.NORMAL = accessorForAttribute(geometry.getAttribute("normal"));
  const primitive = { attributes, material: material(color) };
  if (geometry.index) primitive.indices = accessorForIndex(geometry.index);
  meshes.push({ name, primitives: [primitive] });
  nodes.push({ name, mesh: meshes.length - 1, translation: position, rotation: new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation)).toArray(), scale });
}

const skin = "#293443";
const core = "#FFD166";
const chest = "#FF8765";
const back = "#60A5FA";
const shoulder = "#D28CFF";
const arm = "#F9B371";
const leg = "#B8FF3D";
const glute = "#FF6FAE";
const calf = "#7CE9DD";

addPart("Head", new THREE.SphereGeometry(0.33, 16, 12), skin, [0, 2.75, 0]);
addPart("Neck", new THREE.CylinderGeometry(0.16, 0.2, 0.26, 12), skin, [0, 2.43, 0]);
addPart("Torso", new THREE.CapsuleGeometry(0.63, 1.08, 10, 16), skin, [0, 1.57, 0], [0, 0, 0], [0.95, 1, 0.56]);
addPart("Chest_L", new THREE.SphereGeometry(0.39, 14, 10), chest, [-0.32, 1.91, 0.37], [0, 0, 0], [1, 0.7, 0.36]);
addPart("Chest_R", new THREE.SphereGeometry(0.39, 14, 10), chest, [0.32, 1.91, 0.37], [0, 0, 0], [1, 0.7, 0.36]);
addPart("Core", new THREE.BoxGeometry(0.62, 0.8, 0.18), core, [0, 1.25, 0.43], [0, 0, 0], [1, 1, 1]);
addPart("Back", new THREE.BoxGeometry(1.14, 1.12, 0.2), back, [0, 1.58, -0.43], [0, 0, 0], [1, 1, 1]);
addPart("Shoulder_L", new THREE.SphereGeometry(0.29, 14, 10), shoulder, [-0.72, 2.04, 0], [0, 0, 0], [1, 1, 1]);
addPart("Shoulder_R", new THREE.SphereGeometry(0.29, 14, 10), shoulder, [0.72, 2.04, 0], [0, 0, 0], [1, 1, 1]);
addPart("Biceps_L", new THREE.CapsuleGeometry(0.17, 0.54, 8, 12), arm, [-0.91, 1.54, 0.08], [0, 0, -0.12]);
addPart("Biceps_R", new THREE.CapsuleGeometry(0.17, 0.54, 8, 12), arm, [0.91, 1.54, 0.08], [0, 0, 0.12]);
addPart("Triceps_L", new THREE.CapsuleGeometry(0.16, 0.5, 8, 12), arm, [-0.91, 1.54, -0.14], [0, 0, -0.12]);
addPart("Triceps_R", new THREE.CapsuleGeometry(0.16, 0.5, 8, 12), arm, [0.91, 1.54, -0.14], [0, 0, 0.12]);
addPart("Glute_L", new THREE.SphereGeometry(0.35, 14, 10), glute, [-0.28, 0.68, -0.26], [0, 0, 0], [1, 0.8, 0.55]);
addPart("Glute_R", new THREE.SphereGeometry(0.35, 14, 10), glute, [0.28, 0.68, -0.26], [0, 0, 0], [1, 0.8, 0.55]);
addPart("Quadriceps_L", new THREE.CapsuleGeometry(0.27, 0.83, 8, 14), leg, [-0.31, 0.05, 0.14]);
addPart("Quadriceps_R", new THREE.CapsuleGeometry(0.27, 0.83, 8, 14), leg, [0.31, 0.05, 0.14]);
addPart("Hamstring_L", new THREE.CapsuleGeometry(0.25, 0.78, 8, 14), leg, [-0.31, 0.05, -0.18]);
addPart("Hamstring_R", new THREE.CapsuleGeometry(0.25, 0.78, 8, 14), leg, [0.31, 0.05, -0.18]);
addPart("Calf_L", new THREE.CapsuleGeometry(0.19, 0.53, 8, 12), calf, [-0.32, -0.82, -0.08]);
addPart("Calf_R", new THREE.CapsuleGeometry(0.19, 0.53, 8, 12), calf, [0.32, -0.82, -0.08]);

const binary = Buffer.concat(chunks);
const gltf = { asset: { version: "2.0", generator: "IronPulse Anatomy GLB" }, scene: 0, scenes: [{ name: "IronPulse Muscular Anatomy", nodes: nodes.map((_, index) => index) }], nodes, meshes, materials, buffers: [{ byteLength: binary.length }], bufferViews, accessors };
let json = Buffer.from(JSON.stringify(gltf), "utf8");
json = pad4(json, 0x20);
const header = Buffer.alloc(12);
header.writeUInt32LE(0x46546c67, 0);
header.writeUInt32LE(2, 4);
header.writeUInt32LE(12 + 8 + json.length + 8 + binary.length, 8);
const jsonChunkHeader = Buffer.alloc(8);
jsonChunkHeader.writeUInt32LE(json.length, 0);
jsonChunkHeader.writeUInt32LE(0x4e4f534a, 4);
const binChunkHeader = Buffer.alloc(8);
binChunkHeader.writeUInt32LE(binary.length, 0);
binChunkHeader.writeUInt32LE(0x004e4942, 4);
fs.writeFileSync(path.join(outDir, "ironpulse-muscles.glb"), Buffer.concat([header, jsonChunkHeader, json, binChunkHeader, binary]));
console.log(`Generated ${meshes.length} named mesh parts in ${path.join(outDir, "ironpulse-muscles.glb")}`);
