# SDD Workflow Test — Hola Mundo

**Objetivo:** Probar el ciclo completo de SDD con los 6 agentes primarios.
**Branch:** `test/sdd-workflow` (se descarta después de probar)
**Resultado esperado:** Una página web con "Hola Mundo" animada en el centro de la pantalla.

> **Instrucciones:** Copia y pega cada prompt en orden. Observa qué agente se activa en cada paso y si el plugin inyecta las role rules correctas.

---

## Paso 1 — DEFINE (`/spec`)

**Agente esperado:** Quetzalcoatl
**Fase SDD:** define

```
/spec Quiero una página web sencilla que muestre "Hola Mundo" en el centro de la pantalla. Solo eso, sin nada más. La página debe ser HTML puro con CSS y algo de animación sutil.
```

---

## Paso 2 — DESIGN (`/design`)

**Agente esperado:** Quetzalcoatl
**Fase SDD:** define (design es soporte de /spec)

```
/design Quiero que mi página web tenga un diseño moderno y minimalista. El texto "Hola Mundo" debe estar en el centro exacto de la pantalla con una fuente elegante. Agrega una animación sutil de fade-in al cargar.
```

---

## Paso 3 — PLAN (`/plan`)

**Agente esperado:** Moctezuma
**Fase SDD:** plan

```
/plan Divide esto en tareas pequeñas: 1) Crear el archivo HTML con la estructura básica, 2) Agregar CSS con centering y tipografía, 3) Implementar la animación fade-in.
```

---

## Paso 4 — BUILD (`/build`)

**Agente esperado:** Tlaloc
**Fase SDD:** build

```
/build Implementa el primer paso del plan: crea el archivo HTML con la estructura básica y el contenido "Hola Mundo". Incluye también el CSS para centrar el texto en pantalla.
```

---

## Paso 5 — BUILD continuación (`/build`)

**Agente esperado:** Tlaloc
**Fase SDD:** build

```
/build Implementa el paso 2: agrega CSS con una fuente moderna (Geist, Inter o similar), colores elegantes (fondo oscuro, texto claro), y centra el texto perfectamente en el viewport.
```

---

## Paso 6 — BUILD continuación (`/build`)

**Agente esperado:** Tlaloc
**Fase SDD:** build

```
/build Implementa el paso 3: agrega una animación de fade-in sutil al texto "Hola Mundo" cuando se carga la página. Usa CSS puro con keyframes.
```

---

## Paso 7 — TEST (`/test`)

**Agente esperado:** Mictlantecuhtli
**Fase SDD:** verify

```
/test Verifica que el archivo HTML generado sea válido, que el CSS esté correctamente estructurado, y que la animación fade-in esté presente en el código. Revisa que no haya errores de sintaxis.
```

---

## Paso 8 — REVIEW (`/review`)

**Agente esperado:** Tezcatlipoca
**Fase SDD:** review

```
/review Revisa el código generado. Evalúa: ¿el HTML es válido? ¿El CSS usa buenas prácticas? ¿La animación es performante (usa transform/opacity)? ¿El diseño es limpio y minimalista?
```

---

## Paso 9 — CODE SIMPLIFY (`/code-simplify`) — Opcional

**Agente esperado:** Tlaloc
**Fase SDD:** review (simplification)

```
/code-simplify Si hay código innecesario o complejo en el HTML/CSS generado, simplifícalo. Mantén solo lo esencial para el "Hola Mundo" animado.
```

---

## Paso 10 — SHIP (`/ship`)

**Agente esperado:** Mictlantecuhtli
**Fase SDD:** ship

```
/ship Prepara el archivo final. Asegúrate de que esté listo para servir. No necesitamos CI/CD, solo verifica que el archivo sea funcional y esté en su ubicación correcta.
```

---

## Checklist de verificación

Después de completar los 10 pasos, verifica:

- [ ] **Paso 1-2:** Quetzalcoatl respondió (no escribió código)
- [ ] **Paso 3:** Moctezuma descompuso en tareas (no escribió código)
- [ ] **Paso 4-6:** Tlaloc escribió el código HTML/CSS
- [ ] **Paso 7:** Mictlantecuhtli validó el código
- [ ] **Paso 8:** Tezcatlipoca revisó sin escribir nada
- [ ] **Paso 9:** Tlaloc simplificó (si fue necesario)
- [ ] **Paso 10:** Mictlantecuhtli preparó el archivo final
- [ ] El archivo `hola-mundo.html` (o similar) existe y se puede abrir en navegador
- [ ] El plugin inyectó las role rules correctas en cada paso
- [ ] **FIX VERIFICADO:** En el paso 3, Moctezuma se activó correctamente (no Quetzalcoatl)

## Bugs conocidos corregidos

- **Command override:** Los comandos `/plan`, `/build`, etc. ahora siempre cambian el agente, sin importar el estado anterior. Antes, si Quetzalcoatl ya estaba activo, `/plan` no cambiaba a Moctezuma.
- **Phase auto-update:** Los comandos ahora también actualizan `pipeline_phase` automáticamente (ej. `/plan` → fase `plan`).

## Limpieza

Al terminar la prueba:

```bash
git checkout feat/plugin-orchestration
git branch -D test/sdd-workflow
```
