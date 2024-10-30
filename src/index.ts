import { Context, z, Service } from 'koishi'
import {} from 'koishi-plugin-w-node'

import type skia from '@willbot-koishi/skia-canvas'

export const name = 'w-canvas'

declare module 'koishi' {
    interface Context {
        canvas: CanvasService
    }
}

class CanvasService extends Service {
    static readonly inject = [ 'node' ]

    public skia: typeof skia

    private oldImage: typeof Image

    public async start() {
        const skia = await this.ctx.node.safeImport<typeof skia>('@willbot-koishi/skia-canvas')
        this.skia = skia
        this.oldImage = global.Image
        global.Image = skia.Image
    }

    public constructor(ctx: Context, public config: CanvasService.Config) {
        super(ctx, 'canvas')

        this.ctx.on('dispose', () => {
            global.Image = this.oldImage
        })
    }
}

namespace CanvasService {
    export interface Config {}
    export const Config: z<Config> = z.object({})
}

export default CanvasService
