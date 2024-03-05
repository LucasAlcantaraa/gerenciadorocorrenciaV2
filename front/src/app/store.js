import { configureStore } from '@reduxjs/toolkit'
import itemOcorrencia from './ocorrencia/itemOcorrencia'

export default configureStore({
  reducer: {
    item: itemOcorrencia,
  },
})