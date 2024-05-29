const { default: HelperFunction } = require('./HelperFunctions')
const { validateInput } = require('./validationHelper')

export default async function handleSubmitHelper(initialValues, validationRules, dispatch) {
  console.log('IIIIIII',
  initialValues);
  var formData = new FormData()
  Object.keys(initialValues).forEach((key) => {
    if (
      key !== 'featured' &&
      key !== 'gallery' &&
      key !== 'variant_images' &&
      key !== 'featured_image' &&
      key !== 'isTaxable'
    ) {
      if (initialValues[key]) {
        formData.append(
          key,
          HelperFunction.isJSON(initialValues[key])
            ? JSON.stringify(initialValues[key])
            : initialValues[key],
        )
      }
    }
    if (
      key == 'featured_image' &&
      initialValues['featured_image'] !== '' &&
      initialValues['featured_image'] !== null
    ) {
      formData.append(`featured_image`, initialValues['featured_image'])
    }
    if (key === 'gallery' && initialValues['gallery'].length > 0) {
      for (let i = 0; i < initialValues['gallery'].length; i++) {
        formData.append(`gallery`, initialValues['gallery'][i])
      }
    }
    if (key === 'variant_images' && initialValues['variant_images'].length > 0) {
      for (let i = 0; i < initialValues['variant_images'].length; i++) {
        formData.append(`variant_images`, initialValues['variant_images'][i])
      }
    }
    if (key == 'isTaxable') {
      formData.append(`isTaxable`, initialValues['isTaxable'])
    }
    if (key == 'featured') {
      formData.append(`featured`, initialValues.featured)
    }
  })
  var validations = validateInput(initialValues, validationRules)
  if (validations.length > 0) {
    dispatch({ type: 'set', validations: validations })
    return false
  }
  dispatch({ type: 'set', validations: [] })
  return formData
}
