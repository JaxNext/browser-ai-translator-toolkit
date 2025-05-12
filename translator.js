let translator = null

async function checkAvailability({ sourceLanguage, targetLanguage }) {
  let obj = {
    available: false,
    message: '',
  }
  const res = await Translator.availability({ sourceLanguage, targetLanguage })
  if (res === 'unavailable') {
    obj.message = '当前浏览器不支持，请升级到最新版本或检查配置'
  } else if (res !== 'available') {
    obj.message = '模型加载中，请稍后再试试'
  } else {
    obj.available = true
  }
  return obj
}

export async function genTranslator({ sourceLanguage, targetLanguage }) {
  const obj = await checkAvailability({ sourceLanguage, targetLanguage })
  if (!obj.available) throw new Error(obj.message)
  return await Translator.create({ sourceLanguage, targetLanguage })
}

export async function translate({ text, sourceLanguage, targetLanguage }) {
  translator = translator || (await genTranslator({ sourceLanguage, targetLanguage }))
  if (!translator) return
  return await translator.translate(text)
}

export const checkTranslatorAvailability = checkAvailability
