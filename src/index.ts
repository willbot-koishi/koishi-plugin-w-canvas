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
    public Canvas: typeof skia.Canvas
    public Path2D: typeof skia.Path2D
    public ImageData: typeof skia.ImageData
    public Image: typeof skia.Image
    public DOMPoint: typeof skia.DOMPoint
    public DOMMatrix: typeof skia.DOMMatrix
    public DOMRect: typeof skia.DOMRect
    
    private oldImage: typeof Image

    public async start() {
        const skia = await this.ctx.node.safeImport<typeof skia>('@willbot-koishi/skia-canvas')
        this.skia = skia
        void ({
            Canvas: this.Canvas,
            Path2D: this.Path2D,
            ImageData: this.ImageData,
            Image: this.Image,
            DOMPoint: this.DOMPoint,
            DOMMatrix: this.DOMMatrix,
            DOMRect: this.DOMRect,
        } = skia)

        this.oldImage = global.Image
        global.Image = skia.Image
    }

    public createCanvas(width: number, height: number, _svgFlag: any) {
        return new this.Canvas(width, height)
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
