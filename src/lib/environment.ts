import { Kazagumo } from 'kazagumo'

declare module '@sapphire/pieces' {
    interface Container {
        kazagumo: Kazagumo
    }
}