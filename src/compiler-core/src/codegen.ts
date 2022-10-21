import { NodeTypes } from "./ast"
import { helperMapName, TO_DISPLAY_STRING } from "./runtimeHelpers"

export const generate = function(ast) {
  const context = createCodegenContext()
  const { push } = context
  // push('return ')
  genFunctionPreamble(ast, context) // 新增

  const functionName = 'render'
  const args = ['_ctx', '_cache']
  const signature = args.join(',')
  
  push(`function ${functionName}(${signature}){`)
  push('return ')
  genNode(ast.codegenNode, context)
  push('}')

  return {
    code: context.code
  }
}

// 新增
const genFunctionPreamble = function(ast, context) {
  const { push } = context
  const VueBinging = 'Vue'

  const aliasHelper = s => `${helperMapName[s]}: _${helperMapName[s]}`

  if(ast.helpers.length > 0) {
    push(`const { ${ast.helpers.map(aliasHelper).join(', ') } } = ${VueBinging}`)
  }

  push('\n')
  push('return ')
}

const createCodegenContext = function() {
  const context = {
    code: '',
    push(source) {
      context.code += source
    },
    helper(key) { // 新增
      return `_${helperMapName[key]}` // 新增
    }
  }

  return context
}

// 修改
const genNode = function(node, context) {
 switch(node.type) {
    case NodeTypes.TEXT:
      genText(node, context)
      break
    case NodeTypes.INTERPOLATION:
      genInterpolation(node, context)
      break
    case NodeTypes.SIMPLE_EXPRESSION:
      genExpression(node, context)
      break
    default:
      break
 }
}

const genInterpolation = function(node, context) {
  const { push, helper } = context

  push(`${helper(TO_DISPLAY_STRING)}(`)
  genNode(node.content, context)
  push(')')
}

const genExpression = function(node, context) {
  const { push } = context
  push(`${node.content}`)
}

const genText = function(node, context) {
  const { push } = context
  push(`${node.content}`)
}