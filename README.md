## Análise Postural (Simetrógrafo)

O sistema inclui uma versão digital do **simetrógrafo** — instrumento tradicional de avaliação postural, formado por um quadro com linhas horizontais e verticais, usado para identificar assimetrias corporais comparando pontos anatômicos do paciente contra essas referências. A ideia do projeto é correlacionar esses desvios posturais com o tipo de maloclusão registrado em cada paciente.

### Como funciona

Ao clicar em **"Analisar Simetrógrafo"** sobre uma foto do paciente, três etapas acontecem em sequência:

1. **Detecção de pose (IA)** — a imagem é processada pelo [MediaPipe Pose Landmarker](https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker), um modelo de rede neural pré-treinado (BlazePose, do Google) especializado em estimar 33 pontos-chave do corpo humano a partir de uma única foto. A inferência roda **inteiramente no navegador** via WebAssembly: o modelo é baixado uma vez de um CDN e a foto nunca é enviada a nenhum servidor para essa etapa — é a única parte do fluxo que de fato usa IA.
2. **Cálculo das métricas (matemática, não IA)** — a partir dos pontos detectados (nariz, ombros e quadril), calculamos por trigonometria simples (`atan2`) a inclinação de ombros e de quadril, além do desvio lateral de cada um em relação a um eixo vertical de referência (alinhado ao nariz, como no simetrógrafo físico tradicional). Essa etapa é código determinístico comum, sem nenhum modelo de IA envolvido.
3. **Overlay do grid** — as linhas horizontais/verticais e os pontos-chave são desenhados sobre a foto em um `<canvas>`, reproduzindo visualmente o quadro do simetrógrafo tradicional.

### Onde está o código

| Camada                                      | Arquivo                                                       |
| ------------------------------------------- | ------------------------------------------------------------- |
| Carregamento do modelo de IA                | `src/lib/pose-landmarker.ts`                                  |
| Orquestração da análise                     | `src/lib/analyze-posture.ts`                                  |
| Cálculo das métricas                        | `src/lib/posture-metrics.ts`                                  |
| Desenho do grid                             | `src/components/patients/posture/posture-analysis-canvas.tsx` |
| Integração na UI (botão, resultado, salvar) | `src/components/patients/dialogs/patient-image-lightbox.tsx`  |

### Persistência

Ao salvar uma análise, os pontos detectados e as métricas calculadas são enviados ao backend (`POST /patients/:id/posture-analyses`) e ficam armazenados vinculados ao paciente e à imagem — preparando o terreno para, futuramente, cruzar esse histórico postural com o dado de maloclusão de cada paciente.

---
