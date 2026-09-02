import type { Plugin } from 'vite'
import { profile } from '../src/data/profile'
import { buildVCard } from '../src/lib/vcard'

/**
 * profile.ts 에서 card.vcf 를 만들어 낸다.
 *
 * JS Blob 다운로드를 쓰지 않는 이유: iOS 13 이후 Safari 는 Blob 으로 받은
 * vCard 를 미리보기로만 띄우고 "연락처에 추가"를 공유 시트 안으로 숨긴다.
 * 정적 .vcf 파일을 그냥 링크로 걸면 iOS 는 연락처 시트를, 안드로이드는
 * 다운로드를 띄운다. 그래서 파일로 뽑는다.
 */
export function vcardPlugin(): Plugin {
  const fileName = 'card.vcf'

  return {
    name: 'vcard',

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.endsWith(`/${fileName}`)) return next()
        res.setHeader('Content-Type', 'text/vcard; charset=utf-8')
        res.end(buildVCard(profile))
      })
    },

    generateBundle() {
      this.emitFile({ type: 'asset', fileName, source: buildVCard(profile) })
    },
  }
}
