let translator = null

async function checkUsability({ sourceLanguage, targetLanguage }) {
  let obj = {
    available: false,
    apiPath: '',
    createFuncName: '',
  }
  // if (ai?.languageModel?.capabilities) {
  //   const res = await ai.languageModel?.capabilities()
  //   obj.available = res?.available === 'readily'
  //   obj.apiPath = ['ai', 'languageModel']
  //   obj.createFuncName = 'create'
  //   console.log('ai.languageModel', res)
  // } else 
  // todo: 先用 translation 实现
  if (!translation?.canTranslate) {
    obj.msg = '当前浏览器不支持 translation API'
    return obj
  }
  const res = await translation.canTranslate({
    sourceLanguage: sourceLanguage,
    targetLanguage: targetLanguage,
  })
  obj.available = res === 'readily'
  obj.apiPath = ['translation']
  obj.createFuncName = 'createTranslator'
  obj.canFuncName = 'canTranslate'
  if (!obj.available) {
    obj.msg = '当前浏览器不支持该语种翻译'
  }
  return obj
}
export async function genTranslator({ sourceLanguage, targetLanguage }) {
  const { available, apiPath, createFuncName, canFuncName, msg } = await checkUsability({ sourceLanguage, targetLanguage })
  if (!available) throw new Error(msg)
  const canRes = await translation[canFuncName]({ sourceLanguage: sourceLanguage, targetLanguage: targetLanguage })

  let apiRoot = window
  for (let i = 0; i < apiPath.length; i++) {
    const path = apiPath[i]
    apiRoot = apiRoot[path]
  }
  return await apiRoot[createFuncName]({ sourceLanguage: sourceLanguage, targetLanguage: targetLanguage })
}

export async function translate({ text, sourceLanguage, targetLanguage }) {
  translator = translator || (await genTranslator({ sourceLanguage, targetLanguage }))
  if (!translator) return
  return await translator.translate(text)
}

export async function updateTranslator({ sourceLanguage, targetLanguage }) {
  translator = await genTranslator({ sourceLanguage, targetLanguage })
}
