import * as THREE from "three";

export function createBrainModel() {
    const brainGroup = new THREE.Group();
    
    // Create left hemisphere
    const leftHemisphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 32, 32),
        new THREE.MeshPhongMaterial({
            color: 0x4a90e2,
            transparent: true,
            opacity: 0.8,
            shininess: 100
        })
    );
    leftHemisphere.position.x = -0.5;
    leftHemisphere.scale.set(1, 1.2, 1);
    
    // Create right hemisphere
    const rightHemisphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 32, 32),
        new THREE.MeshPhongMaterial({
            color: 0x4a90e2,
            transparent: true,
            opacity: 0.8,
            shininess: 100
        })
    );
    rightHemisphere.position.x = 0.5;
    rightHemisphere.scale.set(1, 1.2, 1);
    
    // Create cerebellum
    const cerebellum = new THREE.Mesh(
        new THREE.SphereGeometry(0.6, 32, 32),
        new THREE.MeshPhongMaterial({
            color: 0x4a90e2,
            transparent: true,
            opacity: 0.8,
            shininess: 100
        })
    );
    cerebellum.position.y = -0.8;
    cerebellum.scale.set(1, 0.8, 1);
    
    // Add all parts to the group
    brainGroup.add(leftHemisphere);
    brainGroup.add(rightHemisphere);
    brainGroup.add(cerebellum);
    
    // Add some detail with smaller spheres
    for (let i = 0; i < 20; i++) {
        const detail = new THREE.Mesh(
            new THREE.SphereGeometry(0.1 + Math.random() * 0.1, 16, 16),
            new THREE.MeshPhongMaterial({
                color: 0x4a90e2,
                transparent: true,
                opacity: 0.6,
                shininess: 100
            })
        );
        
        // Position the detail randomly on the surface of the brain
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 1 + Math.random() * 0.2;
        
        detail.position.x = radius * Math.sin(phi) * Math.cos(theta);
        detail.position.y = radius * Math.sin(phi) * Math.sin(theta);
        detail.position.z = radius * Math.cos(phi);
        
        brainGroup.add(detail);
    }
    
    return brainGroup;
} 