class PerlinNoise1D {
  constructor() {
    // 1. Permutationstabelle (Zufällige Anordnung der Zahlen 0-255)
    const p = Array.from({ length: 256 }, (_, i) => i).sort(() => Math.random() - 0.5);
    // Verdoppeln für sicheren Indexzugriff bei (x + 1)
    this.permutation = [...p, ...p];
  }

  // 2. Fade-Funktion (Glättungskurve nach Ken Perlin)
  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  // 3. Lineare Interpolation (Lerp)
  lerp(t, a, b) {
    return a + t * (b - a);
  }

  // 4. 1D Gradientenfunktion: Bestimmt das Skalarprodukt basierend auf dem Hash
  grad(hash, x) {
    // Wenn das erste Bit des Hashes 0 ist, ist der Vektor +1, sonst -1
    return (hash & 1) === 0 ? x : -x;
  }

  // Hauptfunktion für 1D Noise
  noise(x) {
    // Bestimme die linke Gitterecke (Integer-Wert)
    let X = Math.floor(x) & 255;

    // Relative Position innerhalb der Zelle (0.0 bis 1.0)
    let xf = x - Math.floor(x);

    // Glättungsfaktor berechnen
    let u = this.fade(xf);

    // Hash-Werte für die linke (X) und rechte (X + 1) Ecke holen
    const a = this.permutation[X];
    const b = this.permutation[X + 1];

    // Skalarprodukte für beide Ecken berechnen
    const gradLeft = this.grad(a, xf);       // Abstand zur linken Ecke ist xf
    const gradRight = this.grad(b, xf - 1);  // Abstand zur rechten Ecke ist xf - 1

    // Finale Interpolation zwischen den beiden Werten
    return this.lerp(u, gradLeft, gradRight);
  }
}


// --- ANWENDUNGSBEISPIEL ---
const perlin1D = new PerlinNoise1D();

// Auch hier gilt: Skaliere die Werte mit einem kleinen Schrittfaktor!
let step = 0.05;
for (let i = 0; i < 100; i++) {
    console.log(perlin1D.noise(i*step))
  //console.log(`Noise bei Position ${i * step}:`, perlin1D.noise(i * step));
}


