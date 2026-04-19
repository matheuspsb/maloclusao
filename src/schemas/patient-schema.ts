import * as yup from "yup"

export const patientSchema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
  age: yup
    .number()
    .typeError("Idade deve ser um número")
    .min(0, "Idade inválida")
    .max(18, "Idade máxima: 18 anos")
    .required("Idade é obrigatória"),
  gender: yup
    .string()
    .oneOf(["M", "F"], "Selecione o sexo")
    .required("Sexo é obrigatório"),
  guardian: yup.string().required("Responsável é obrigatório"),
  malocclusion: yup
    .string()
    .oneOf(["Classe I", "Classe II", "Classe III", "Nenhuma"], "Selecione a classificação")
    .required("Classificação é obrigatória"),
  stabilometry: yup
    .number()
    .typeError("Desvio deve ser um número")
    .min(0, "Valor mínimo: 0")
    .required("Desvio é obrigatório"),
  stabilometryLevel: yup
    .string()
    .oneOf(["Normal", "Leve", "Moderado", "Severo"], "Selecione o grau")
    .required("Grau é obrigatório"),
  images: yup.array().of(yup.string().required()).optional().default([]),
})

export type PatientForm = yup.InferType<typeof patientSchema>
