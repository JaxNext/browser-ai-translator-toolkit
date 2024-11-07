let detector = null
async function checkUsability() {
  let obj = {
    available: false,
    apiPath: '',
    createFuncName: '',
  }
  if (ai?.languageDetector?.capabilities) {
    const res = await ai.languageDetector?.capabilities()
    obj.available = res?.available === 'readily'
    obj.apiPath = ['ai', 'languageDetector']
    obj.createFuncName = 'create'
    console.log('ai.languageDetector', res)
  } else if (translation?.canDetect) {
    const res = await translation.canDetect()
    obj.available = res === 'readily'
    obj.apiPath = ['translation']
    obj.createFuncName = 'createDetector'
    console.log('translation', res)
  }
  return obj
}
async function genDetector() {
  const { available, apiPath, createFuncName } = await checkUsability()
  if (!available) throw new Error(`当前浏览器不支持 ${apiPath} 语言检测`)
  let apiRoot = window
  for (let i = 0; i < apiPath.length; i++) {
    const path = apiPath[i]
    apiRoot = apiRoot[path]
  }
  return await apiRoot[createFuncName]()
}
export async function detect(text) {
  detector = detector || (await genDetector())

  const result = await detector.detect(text)
  const defaultLang = 'en'
  if (!result?.length) return defaultLang
  const mostLikely = result.sort((a, b) => b.confidence - a.confidence)[0]
  const lang = mostLikely?.detectedLanguage || defaultLang

  return {
    text: lang,
    value: lang,
  }
}

export const checkDetectorUsability = checkUsability
