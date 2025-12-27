import { ref, inject } from 'vue'
import type { App, Ref, InjectionKey } from 'vue'

import Modal from './Modal.vue'
import ModalOrchestrator from './ModalOrchestrator.vue'
import { PROVIDE_KEY } from './variables'
import type { ModalOpenParams } from './modal-open-params'

import { registerComponent, registerComponentProgrammatic } from '../../utils/plugins'

class ModalProgrammatic {
    private modals: Ref<ModalOpenParams[]>

    constructor(app: App) {
        this.modals = ref([])
        app.provide(PROVIDE_KEY, this.modals)
    }

    open(params: ModalOpenParams | string) {
        if (typeof params === 'string') {
            params = {
                content: params
            }
        }

        this.modals.value.push(params)
    }
}

const modalInjectionKey = Symbol('Buefy Modal') as InjectionKey<ModalProgrammatic>

export function useModal() {
    return inject(modalInjectionKey)!
}

const Plugin = {
    install(Vue: App) {
        registerComponent(Vue, Modal)
        registerComponent(Vue, ModalOrchestrator)
        registerComponentProgrammatic(Vue, 'modal', new ModalProgrammatic(Vue), modalInjectionKey)
    }
}

export default Plugin

export {
    ModalProgrammatic,
    Modal as BModal,
    ModalOrchestrator as BModalOrchestrator
}
