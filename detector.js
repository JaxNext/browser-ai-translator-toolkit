let detector = null
async function checkAvailability() {
  const obj = {
    available: false,
    message: '',
  }
  const res = await self?.LanguageDetector?.availability?.()
  if (res === 'unavailable') {
    obj.message = '当前浏览器不支持，请升级到最新版本或检查配置'
  } else if (res !== 'available') {
    obj.message = '模型加载中，请稍后再试试'
  } else {
    obj.available = true
  }
  return obj
}
export async function genDetector() {
  const obj = await checkAvailability()
  if (!obj.available) throw new Error(obj.message)
  return await self.LanguageDetector.create()
}
export async function detect(text) {
  detector = detector || (await genDetector())

  const result = await detector.detect(text)
  const defaultStr = 'unknown'
  if (!result?.length) return defaultStr
  const mostLikely = result.sort((a, b) => b.confidence - a.confidence)[0]
  const lang = mostLikely?.detectedLanguage || defaultStr

  return {
    text: lang,
    value: lang,
  }
}

export const checkDetectorAvailability = checkAvailability
