import * as Yup from 'yup';

const step1Schema = Yup.object({
  name: Yup.string().required('el nombre es obligatorio'),
  last_name: Yup.string().required('el apellido es obligatorio'),
  nationality: Yup.string().required('el pais es obligatorio'),
});

const step2Schema = Yup.object({
  email: Yup.string().required('el correo es obligatorio'),
  phone: Yup.string().required('el telefono es obligatorio'),
});

const step3Schema = Yup.object({
  //corporate_email: Yup.string().email("El correo no es valido").required('el correo es obligatorio'),
  //position: Yup.string().required('el cargo es obligatorio'),
});

const step4Schema = Yup.object({
  //corporate_email: Yup.string().email("El correo no es valido").required('el correo es obligatorio'),
  //position: Yup.string().required('el cargo es obligatorio'),
});

const step5Schema = Yup.object({
  //corporate_email: Yup.string().email("El correo no es valido").required('el correo es obligatorio'),
  //position: Yup.string().required('el cargo es obligatorio'),
});


export const stepsSchemas = [
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema
]