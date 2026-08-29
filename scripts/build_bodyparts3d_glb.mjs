import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const sourceDir = path.join(root, "assets/anatomy-source/selected");
const destination = path.join(root, "assets/models/ironpulse-bodyparts3d-muscles.glb");

const GROUPS = {
  Chest: ["FJ1447", "FJ1447M", "FJ1464", "FJ1464M", "FJ1446", "FJ1446M"],
  Shoulder: ["FJ1468", "FJ1468M", "FJ1467", "FJ1467M", "FJ1513", "FJ1513M"],
  Biceps: ["FJ1512", "FJ1512M", "FJ1478", "FJ1478M"],
  Triceps: ["FJ1479", "FJ1479M", "FJ1480", "FJ1480M", "FJ1477", "FJ1477M"],
  Glute: ["FJ1418", "FJ1418M"],
  Quadriceps: ["FJ1433", "FJ1433M", "FJ1442", "FJ1442M", "FJ1443", "FJ1443M"],
  Hamstring: ["FJ1395", "FJ1395M", "FJ1444", "FJ1444M"],
  Calf: ["FJ1394", "FJ1394M", "FJ1397", "FJ1397M"],
  Back: ["FJ1520", "FJ1520M", "FJ1554", "FJ1554M", "FJ1521", "FJ1521M"],
  Core: ["FJ1452", "FJ1452M"],
};

const COLORS = {
  Chest: [0.66, 0.065, 0.075, 1], Shoulder: [0.74, 0.09, 0.11, 1], Biceps: [0.72, 0.08, 0.08, 1],
  Triceps: [0.65, 0.06, 0.065, 1], Glute: [0.62, 0.055, 0.07, 1], Quadriceps: [0.7, 0.075, 0.08, 1],
  Hamstring: [0.6, 0.045, 0.055, 1], Calf: [0.72, 0.09, 0.09, 1], Back: [0.63, 0.05, 0.06, 1], Core: [0.76, 0.1, 0.09, 1],
};

function parseObj(file) {
  const positions = [];
  const triangles = [];
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    if (line.startsWith("v ")) {
      const [x, y, z] = line.slice(2).trim().split(/\s+/).map(Number);
      positions.push([x, y, z]);
    }
    if (line.startsWith("f ")) {
      const indices = line.slice(2).trim().split(/\s+/).map((part) => Number(part.split("/")[0]) - 1);
      for (let i = 1; i < indices.length - 1; i += 1) triangles.push(indices[0], indices[i], indices[i + 1]);
    }
  }
  return { positions, triangles };
}

function normalize(x, y, z) {
  const length = Math.hypot(x, y, z) || 1;
  return [x / length, y / length, z / length];
}

function collectGroup(ids) {
  const positions = [];
  const triangles = [];
  for (const id of ids) {
    const parsed = parseObj(path.join(sourceDir, `${id}.obj`));
    const offset = positions.length;
    positions.push(...parsed.positions);
    for (const index of parsed.triangles) triangles.push(index + offset);
  }
  const normals = Array.from({ length: positions.length }, () => [0, 0, 0]);
  for (let index = 0; index < triangles.length; index += 3) {
    const a = positions[triangles[index]];
    const b = positions[triangles[index + 1]];
    const c = positions[triangles[index + 2]];
    const ux = b[0] - a[0]; const uy = b[1] - a[1]; const uz = b[2] - a[2];
    const vx = c[0] - a[0]; const vy = c[1] - a[1]; const vz = c[2] - a[2];
    const nx = uy * vz - uz * vy; const ny = uz * vx - ux * vz; const nz = ux * vy - uy * vx;
    for (const vertex of [triangles[index], triangles[index + 1], triangles[index + 2]]) { normals[vertex][0] += nx; normals[vertex][1] += ny; normals[vertex][2] += nz; }
  }
  return { positions, normals: normals.map(([x, y, z]) => normalize(x, y, z)), triangles };
}

const groups = Object.entries(GROUPS).map(([name, ids]) => [name, collectGroup(ids)]);
const all = groups.flatMap(([, group]) => group.positions);
const limits = all.reduce((state, [x, y, z]) => ({ min: [Math.min(state.min[0], x), Math.min(state.min[1], y), Math.min(state.min[2], z)], max: [Math.max(state.max[0], x), Math.max(state.max[1], y), Math.max(state.max[2], z)] }), { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] });
const center = limits.min.map((value, index) => (value + limits.max[index]) / 2);
const scale = 4.35 / (limits.max[1] - limits.min[1]);

const chunks = [];
let byteLength = 0;
const append = (bytes) => { const padding = (4 - (bytes.byteLength % 4)) % 4; const chunk = new Uint8Array(bytes.byteLength + padding); chunk.set(new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength)); const offset = byteLength; chunks.push(chunk); byteLength += chunk.byteLength; return { byteOffset: offset, byteLength: bytes.byteLength }; };
const bufferViews = []; const accessors = []; const meshes = []; const nodes = [];
const addAccessor = (view, componentType, count, type, min, max) => { const index = accessors.length; accessors.push({ bufferView: view, componentType, count, type, min, max }); return index; };

for (const [groupName, group] of groups) {
  const transformed = new Float32Array(group.positions.length * 3);
  const normalData = new Float32Array(group.normals.length * 3);
  const minimum = [Infinity, Infinity, Infinity]; const maximum = [-Infinity, -Infinity, -Infinity];
  group.positions.forEach(([x, y, z], index) => {
    const target = [((x - center[0]) * scale), ((y - center[1]) * scale), ((z - center[2]) * scale)];
    transformed.set(target, index * 3); target.forEach((value, axis) => { minimum[axis] = Math.min(minimum[axis], value); maximum[axis] = Math.max(maximum[axis], value); });
    normalData.set(group.normals[index], index * 3);
  });
  const IndexArray = group.positions.length > 65535 ? Uint32Array : Uint16Array;
  const indices = new IndexArray(group.triangles);
  const positionView = bufferViews.push({ buffer: 0, target: 34962, ...append(transformed) }) - 1;
  const normalView = bufferViews.push({ buffer: 0, target: 34962, ...append(normalData) }) - 1;
  const indexView = bufferViews.push({ buffer: 0, target: 34963, ...append(indices) }) - 1;
  const positionAccessor = addAccessor(positionView, 5126, group.positions.length, "VEC3", minimum, maximum);
  const normalAccessor = addAccessor(normalView, 5126, group.normals.length, "VEC3");
  const indexAccessor = addAccessor(indexView, IndexArray === Uint32Array ? 5125 : 5123, indices.length, "SCALAR");
  const material = Object.keys(COLORS).indexOf(groupName);
  meshes.push({ name: groupName, primitives: [{ attributes: { POSITION: positionAccessor, NORMAL: normalAccessor }, indices: indexAccessor, material }] });
  nodes.push({ name: groupName, mesh: meshes.length - 1, extras: { ironpulseMuscleGroup: groupName } });
}

const document = {
  asset: { version: "2.0", generator: "IronPulse BodyParts3D mobile atlas builder", copyright: "BodyParts3D, © The Database Center for Life Science licensed under CC BY 4.0" },
  scene: 0, scenes: [{ name: "Surface muscles", nodes: nodes.map((_, index) => index) }], nodes, meshes,
  materials: Object.entries(COLORS).map(([name, baseColorFactor]) => ({ name, pbrMetallicRoughness: { baseColorFactor, metallicFactor: 0, roughnessFactor: 0.62 }, emissiveFactor: [0.018, 0.0, 0.0], doubleSided: true })),
  accessors, bufferViews, buffers: [{ byteLength }], extras: { source: "BodyParts3D Release 4.0", license: "CC BY 4.0", attribution: "BodyParts3D, © The Database Center for Life Science licensed under CC BY 4.0" },
};

const json = Buffer.from(JSON.stringify(document));
const jsonPadding = (4 - (json.length % 4)) % 4;
const totalLength = 12 + 8 + json.length + jsonPadding + 8 + byteLength;
const glb = Buffer.alloc(totalLength);
glb.writeUInt32LE(0x46546c67, 0); glb.writeUInt32LE(2, 4); glb.writeUInt32LE(totalLength, 8);
glb.writeUInt32LE(json.length + jsonPadding, 12); glb.writeUInt32LE(0x4e4f534a, 16); json.copy(glb, 20); glb.fill(0x20, 20 + json.length, 20 + json.length + jsonPadding);
const binaryHeader = 20 + json.length + jsonPadding; glb.writeUInt32LE(byteLength, binaryHeader); glb.writeUInt32LE(0x004e4942, binaryHeader + 4);
let offset = binaryHeader + 8; for (const chunk of chunks) { Buffer.from(chunk).copy(glb, offset); offset += chunk.byteLength; }
fs.mkdirSync(path.dirname(destination), { recursive: true }); fs.writeFileSync(destination, glb);
console.log(`Created ${path.basename(destination)} with ${nodes.length} selectable muscle groups (${(glb.length / 1024 / 1024).toFixed(2)} MB).`);
