
import { urlApiProducts } from './config'
import axios from 'axios'

export const createProductsApi =async (formData_) => {

try {
const response = await axios ({
url: `${urlApiProducts}/products/create`,
method: 'POST',
data: formData_ ,
})   

return response

} catch (error) {
    console.log(error)
}

}

