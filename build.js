const { execSync } = require('child_process')

const goPlatform = { darwin: 'darwin', linux: 'linux', win32: 'windows' }
const goos = goPlatform[process.platform]
const ext = process.platform === 'win32' ? '.exe' : ''

if (!goos) {
  console.error(`Unsupported platform: ${process.platform}`)
  process.exit(1)
}

// On macOS, both amd64 and arm64 are supported by the system clang toolchain.
// On other platforms, only the host arch is built; use the GHA workflow for cross-arch.
const archs = process.platform === 'darwin' ? ['amd64', 'arm64'] : [process.arch === 'arm64' ? 'arm64' : 'amd64']

for (const goarch of archs) {
  const env = { ...process.env, GOOS: goos, GOARCH: goarch }
  const base = `tray_${goos}_${goarch}`
  console.log(`Building ${base}...`)
  execSync(`go build -o ./${base}${ext} tray.go`, { env, stdio: 'inherit' })
  execSync(`go build -o ./${base}_release${ext} -ldflags "-s -w" tray.go`, { env, stdio: 'inherit' })
  console.log(`  -> ${base}${ext}`)
  console.log(`  -> ${base}_release${ext}`)
}
