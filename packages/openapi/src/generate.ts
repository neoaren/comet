import { Expression, Node, Project, SyntaxKind, TypeFormatFlags } from 'ts-morph'
import { OpenAPIV3_1, OpenAPIV3 } from 'openapi-types'
import { Reply } from '@neoaren/comet'

const project = new Project({
  tsConfigFilePath: "tsconfig.json"
})

// Traverse source files to find and process routes
const sourceFiles = project.addSourceFilesAtPaths(`../example/src/**/*.ts`)

sourceFiles.forEach(sourceFile => {
  // console.log(sourceFile.getFilePath())

  sourceFile.getDescendantsOfKind(SyntaxKind.ExpressionStatement).forEach(call => {

    const ce = call.getFirstChildByKind(SyntaxKind.CallExpression)

    if (ce) {

      const expression = ce.getExpression()
      if (expression.getText() === 'workerRouter.route') {


        // PARSE JSDOC

        const jsdocs = call.getJsDocs().at(0)
        if (jsdocs) {

          const x = jsdocs.getTags().map(tag => {
            const tagName = tag.getTagName()
            const text = tag.getCommentText()?.replaceAll('\r\n', ' ')?.replaceAll('\n', ' ')
            // const actualText = typeof text === 'string' ? text : text.
            return [ tagName, text ]
          })

          const y = Object.fromEntries(x)
          // console.log(y)

        }

        //

        const config = ce.getArguments().at(0)
        if (config && Node.isObjectLiteralExpression(config)) {

          // TODO method, pathname, schemas

          const method = config.getProperty('method')

          if (method && Node.isPropertyAssignment(method)) {

            const initializer = method.getInitializer()
            // console.log(initializer?.getText(), initializer?.getKindName())

            // if (Node.isStringLiteral(initializer)) {
            //   console.log('Found a string literal', initializer.getLiteralValue())
            // } else if (Node.isIdentifier(initializer)) {
            //   console.log('Found an identifier', initializer.getText())
            // }
            //
            // if (Node.isArrayLiteralExpression(initializer)) {
            //   console.log('Found an array literal', initializer.getElements().map(x => x.getText()))
            // }

            OpenAPIV3.HttpMethods

            // const maybeMethod = method.getInitializerIfKind(SyntaxKind.StringLiteral)
            // const maybeMethodList = method.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression)
            //
            // console.log(maybeMethod?.getText(), maybeMethodList?.getText())

            method.getStructure()
            // console.log(method.getStructure())
            // method.forEachChild(x => console.log(x.getText()))
          } else {
            console.log('No method found')
          }

          const pathname = config.getProperty('pathname')

          if (pathname && Node.isPropertyAssignment(pathname)) {
            const initializer = pathname.getInitializer()

            console.log(pathname.getStructure()?.initializer)
          }

          // console.log('Found a route: ', config.getProperty('method')?.getText())

        }

        const handler = ce.getArguments().at(1)
        if (handler && Node.isArrowFunction(handler)) {

          const y = handler.getDescendantsOfKind(SyntaxKind.ReturnStatement).map(x => {
            if (!Node.isReturnStatement(x)) return undefined

            const expression = x.getExpression()
            if (!expression) return undefined

            expression
            TypeFormatFlags

            return expression.getText()
          })
          console.log(y)

          const text = handler.getText()

          const type = handler.getReturnType()

          // console.log(type.getText(), type.isAny(), type.isClass(), type.isClassOrInterface(), type.isStringLiteral())
          //
        }


        const operation: OpenAPIV3_1.OperationObject = {
          // method
          // pathname

          // from js doc
          tags: [],
          summary: '',
          description: '',
          externalDocs: {
            url: '',
            description: ''
          },
          deprecated: false,

          // generated
          operationId: '', // uuid?

          // params and query schemas
          parameters: [
            {
              name: '',
              in: '',
              required: false
            }
          ],

          // body schema
          requestBody: {
            required: false,
            content: {}
          },

          // from return type and js doc @throws
          responses: {
            default: {
              description: '',
              content: {}
            }
          },

          // not supported
          callbacks: undefined,
          security: undefined,
          servers: undefined

        }

      }

    }

    // if (expression?.getText() === 'workerRouter.route') {
    //   console.log('Found a route: ')
    // }

    // call.getJsDocs

  })

})

// METHODS


// JSODC supported

// @see https://jsdoc.app/tags-see



function x(expression: Expression): OpenAPIV3_1.HttpMethods[] {

  if (Node.isStringLiteral(expression)) {
    console.log('Found a string literal', expression.getLiteralValue())
  } else if (Node.isIdentifier(expression)) {
    console.log('Found an identifier', expression.getText())
  }

  if (Node.isArrayLiteralExpression(expression)) {
    console.log('Found an array literal', expression.getElements().map(x => x.getText()))
  }


  return []
}
