import { Asset } from "expo-asset";
import { GLView, type ExpoWebGLRenderingContext } from "expo-gl";
import { Renderer, loadAsync, THREE } from "expo-three";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PanResponder, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { PremiumLoadingState } from "@/components/premium-loading-state";
import type { MuscleGroup } from "@/shared/fitness";

type Props = { selected?: MuscleGroup; onSelect: (muscle: MuscleGroup) => void; onReady?: () => void; onFailure?: () => void };
type SceneState = { scene: THREE.Scene; camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer; model: THREE.Object3D; gl: ExpoWebGLRenderingContext; raf: number; size: { width: number; height: number } };

// Metro, GLB varlığını statik modül numarası olarak yalnızca require ile paketler.
 
const MODEL = require("../assets/models/ironpulse-muscles.glb");
const colors: Record<MuscleGroup, string> = { Göğüs: "#FF8765", Sırt: "#60A5FA", Omuz: "#D28CFF", Biceps: "#F9B371", Triceps: "#F9B371", Quadriceps: "#B8FF3D", Hamstring: "#B8FF3D", Glute: "#FF6FAE", Core: "#FFD166", Baldır: "#7CE9DD" };

// Düğüm adları hem tekil ("Back") hem de taraflı ("Chest_L") gelebildiği için ön ek eşlemesi kullanılır.
function muscleForNode(name: string): MuscleGroup | undefined {
  if (name.startsWith("Chest")) return "Göğüs";
  if (name.startsWith("Back")) return "Sırt";
  if (name.startsWith("Shoulder")) return "Omuz";
  if (name.startsWith("Biceps")) return "Biceps";
  if (name.startsWith("Triceps")) return "Triceps";
  if (name.startsWith("Core")) return "Core";
  if (name.startsWith("Quadriceps")) return "Quadriceps";
  if (name.startsWith("Hamstring")) return "Hamstring";
  if (name.startsWith("Glute")) return "Glute";
  if (name.startsWith("Calf")) return "Baldır";
  return undefined;
}

function setHighlight(model: THREE.Object3D, selected?: MuscleGroup) {
  model.traverse((node: THREE.Object3D) => {
    if (!(node instanceof THREE.Mesh)) return;
    const material = node.material as THREE.MeshStandardMaterial;
    const muscle = muscleForNode(node.name);
    if (!material?.emissive) return;
    material.emissive.set(muscle && muscle === selected ? colors[muscle] : "#150305");
    material.emissiveIntensity = muscle && muscle === selected ? 0.82 : 0.11;
    material.needsUpdate = true;
  });
}

export function GlbAnatomyViewer({ selected, onSelect, onReady, onFailure }: Props) {
  const engine = useRef<SceneState | null>(null);
  const rotation = useRef(0);
  const cameraDistance = useRef(5.8);
  const gesture = useRef({ x: 0, y: 0, rotation: 0 });
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorText, setErrorText] = useState("");

  useEffect(() => () => { if (engine.current) cancelAnimationFrame(engine.current.raf); }, []);
  useEffect(() => { if (engine.current) setHighlight(engine.current.model, selected); }, [selected]);

  const updateCamera = useCallback(() => {
    const current = engine.current;
    if (!current) return;
    current.model.rotation.y = rotation.current;
    current.camera.position.set(0, 0.05, cameraDistance.current);
    current.camera.lookAt(0, 0.02, 0);
  }, []);

  const pick = useCallback((x: number, y: number) => {
    const current = engine.current;
    if (!current) return;
    const pointer = new THREE.Vector2((x / current.size.width) * 2 - 1, -(y / current.size.height) * 2 + 1);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(pointer, current.camera);
    const hit = raycaster.intersectObject(current.model, true)[0];
    const muscle = hit ? muscleForNode(hit.object.name) : undefined;
    if (muscle) onSelect(muscle);
  }, [onSelect]);

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (event) => { gesture.current = { x: event.nativeEvent.locationX, y: event.nativeEvent.locationY, rotation: rotation.current }; },
    onPanResponderMove: (_, state) => { rotation.current = gesture.current.rotation + state.dx * 0.012; updateCamera(); },
    onPanResponderRelease: (event, state) => { if (Math.abs(state.dx) < 6 && Math.abs(state.dy) < 6) pick(event.nativeEvent.locationX, event.nativeEvent.locationY); },
  }), [pick, updateCamera]);

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    try {
      const renderer = new Renderer({ gl }) as unknown as THREE.WebGLRenderer;
      renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
      renderer.setClearColor("#090D12", 1);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(31, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 100);
      scene.add(new THREE.HemisphereLight("#DCEBFF", "#180305", 2.15));
      const keyLight = new THREE.DirectionalLight("#FFE9E2", 3.2); keyLight.position.set(3.4, 5.4, 5.8); scene.add(keyLight);
      const rimLight = new THREE.DirectionalLight("#FF4B5C", 1.35); rimLight.position.set(-4.6, 1.2, -3.6); scene.add(rimLight);
      const floor = new THREE.Mesh(new THREE.CircleGeometry(2.8, 64), new THREE.MeshStandardMaterial({ color: "#171218", roughness: 0.78, metalness: 0.08 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -2.17; scene.add(floor);
      const asset = Asset.fromModule(MODEL); await asset.downloadAsync();
      const loaded = await loadAsync(asset);
      const model = (loaded as { scene: THREE.Object3D }).scene;
      model.scale.setScalar(1);
      model.position.y = 0;
      setHighlight(model, selected);
      scene.add(model);
      engine.current = { scene, camera, renderer, model, gl, raf: 0, size: { width: gl.drawingBufferWidth, height: gl.drawingBufferHeight } };
      updateCamera();
      const animate = () => { const current = engine.current; if (!current) return; current.renderer.render(current.scene, current.camera); current.gl.endFrameEXP(); current.raf = requestAnimationFrame(animate); };
      animate();
      setStatus("ready");
      onReady?.();
    } catch (error) {
      setStatus("error");
      setErrorText(error instanceof Error ? error.message : "3D model yüklenemedi.");
      onFailure?.();
    }
  };

  return <View style={styles.shell} {...panResponder.panHandlers}>
    <GLView style={styles.gl} onContextCreate={onContextCreate} msaaSamples={Platform.OS === "ios" ? 2 : 0} />
    {status === "loading" ? <View style={styles.overlay}><PremiumLoadingState title="3D kas katmanları hazırlanıyor" detail="Seçilebilir anatomik bölgeler güvenle yükleniyor." /></View> : null}
    {status === "error" ? <View style={styles.overlay}><Text style={styles.errorTitle}>3D görünüm açılamadı</Text><Text style={styles.errorCopy}>Bu cihazda güvenli kas atlası görünümüne geri dönülecek.</Text><Text style={styles.errorTechnical}>{errorText}</Text></View> : null}
    {status === "ready" ? <><View style={styles.hint}><Text style={styles.hintText}>Gerçek kas katmanları · döndür · bölgeye dokun</Text></View><View style={styles.zoom}><TouchableOpacity onPress={() => { cameraDistance.current = Math.max(3.7, cameraDistance.current - 0.4); updateCamera(); }} style={styles.zoomButton}><Text style={styles.zoomText}>+</Text></TouchableOpacity><TouchableOpacity onPress={() => { cameraDistance.current = Math.min(8.2, cameraDistance.current + 0.4); updateCamera(); }} style={styles.zoomButton}><Text style={styles.zoomText}>−</Text></TouchableOpacity></View></> : null}
  </View>;
}

const styles = StyleSheet.create({ shell: { height: 460, borderRadius: 26, overflow: "hidden", backgroundColor: "#0D141D", borderColor: "#2C3A4C", borderWidth: 1 }, gl: { flex: 1 }, overlay: { position: "absolute" as const, top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center", backgroundColor: "#0D141DE8", padding: 28 }, errorTitle: { color: "#F5F7FA", fontSize: 16, fontWeight: "900" }, errorCopy: { color: "#9AA6B5", fontSize: 12, lineHeight: 18, textAlign: "center", marginTop: 6 }, errorTechnical: { color: "#657386", fontSize: 10, textAlign: "center", marginTop: 10 }, hint: { position: "absolute", left: 12, bottom: 12, backgroundColor: "#101720DD", borderColor: "#344154", borderWidth: 1, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 99 }, hintText: { color: "#D7DEE8", fontSize: 10, fontWeight: "800" }, zoom: { position: "absolute", top: 12, right: 12, gap: 7 }, zoomButton: { width: 36, height: 36, borderRadius: 12, backgroundColor: "#141A22E8", borderColor: "#344154", borderWidth: 1, alignItems: "center", justifyContent: "center" }, zoomText: { color: "#B8FF3D", fontSize: 23, lineHeight: 24, fontWeight: "700" } });
