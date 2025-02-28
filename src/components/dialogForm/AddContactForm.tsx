import { useEffect } from 'react'
import { useAppDispatch } from '@/lib/hook'
import { useFormik } from 'formik'
import { fetch as FetchClients} from '@/lib/features/clients'
import { ContactForm } from '@/interface/form'
import ErrorAlert from '../core/ErrorAlert'
import ContactPersonal from '../form/ContactPersonal'
import { create, update } from '@/lib/features/contacts'
import * as Yup from 'yup'

const initialValues: ContactForm = {}


const validationSchema = Yup.object({
  name: Yup.string().required('Debes proporcionar un nombre'),
  last_name: Yup.string().required('Debes proporcionar un apellido'),
  email: Yup.string().required('Debes proporcionar un correo'),
  phone: Yup.string().required('Debes proporcionar un telefono'),
  client_id: Yup.number().required('Debes elegir un cliente'),
});

interface Props {
  onSave: () => void;
  isEditMode: boolean;
  contact?: ContactForm;
}

export default function AddContactForm({ onSave, isEditMode, contact = {} }: Props) {

  const dispatch = useAppDispatch()

  const formik = useFormik({
    initialValues: {...initialValues, ...contact},
    validationSchema: validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: values => {
      if(isEditMode){
        dispatch(update(values))
      } else {
        dispatch(create(values))
      }
      
      onSave()
    },
  });

  formik.values

  useEffect(() => {
    dispatch(FetchClients())
  }, [dispatch])

  const handlerClick = async () => {
    formik.submitForm()
  }

  return (
    <div className="bg-white">

      <div className="relative mx-auto grid max-w-7xl gap-x-16  xl:gap-x-48">
      <form className="lg:col-start-1 lg:row-start-1 "  onSubmit={formik.handleSubmit}>
          <div className="mx-auto max-w-lg lg:max-w-none">

              <ContactPersonal 
                handleBlur={formik.handleBlur}
                values={formik.values}
                handleChange={formik.handleChange}
                onSelectorField={(field, value) => {
                  formik.setFieldValue(field, value)
                }}
              />

              
              {Object.values(formik.errors).length > 0 ? (
                 <div className='mt-4'>
                   <ErrorAlert 
                  message={Object.values(formik.errors).join(", ")}
                 />
                  </div>
              ) : null}
             
           
            <div className="mt-10 border-t border-gray-200 pt-6 sm:flex sm:items-center sm:justify-between">
              <button
                type="button"
                className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:order-last sm:ml-6 sm:w-auto"
                onClick={handlerClick}
              >
                Guardar
              </button>
              <p className="mt-4 text-center text-sm text-gray-500 sm:mt-0 sm:text-left">
                
              </p>
            </div>
          </div>
          </form>
      </div>
    </div>
  )
}
