const fs = require('fs')
const path = require('path')

/**
 * 检查src 下文件夹、文件名是否不合规，要求小写或横线
 * @param {*} filePath 
 */
function checkFileName(filePath) {
  const fileNames = filePath.split('/')
  for (let name of fileNames) {
    const isLowerCase = /^[a-z-]+$/.test(name.split('.')[0])
    if (!isLowerCase) {
      console.error(`Invalid file name: ${filePath} should be in lowercase`)
      process.exit(1)
    }
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir)
  for (let file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      walkDir(filePath)
    } else {
      checkFileName(filePath)
    }
  }
}

walkDir('./src')
