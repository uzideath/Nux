import { Kazagumo } from 'kazagumo'

declare module '@sapphire/pieces' {
    interface Container {
        Kazagumo: Kazagumo
    }
}