<script setup lang="ts">
import { toast } from 'vue3-toastify'

import { useRouter } from 'vue-router'
import { useCertificatStore } from '@/store/useCertificatStore'
import { useUploadFileStore } from '@/store/useUploadFileStore'
import AdditionnelInformation from '@/views/pages/demande-forms/additionnel-information.vue'
import PersonnalInformation from '@/views/pages/demande-forms/personnal-information.vue'
import 'vue3-toastify/dist/index.css'

const router = useRouter()

// 👉 - STore
const store = useCertificatStore()
const uploadStore = useUploadFileStore()

const currentCertificat = ref({})

const isDialogueNfsReader = ref(false)
const currentStep = ref<number>(0)
const CNI_READER = import.meta.env.VITE_CNI_READER

const checkoutSteps = [
  {
    title: 'Données Personnelles',
    icon: 'tabler-id',
    currentStep,
  },
  {
    title: 'Pièces Jointes',
    icon: 'tabler-paperclip',
  },
]

/* 👉 Methodes here */
const next = certificat => {
  store.createOne(certificat).then(res => {
    currentCertificat.value = res.data
    currentStep.value++
  }).catch(err => {
    console.log(err)
  })
}

const back = () => {
  currentStep.value--
}

const save = certificate => {
  store.createOne(certificate).then(() => {
    toast.success('Les données ont été enregistrées avec succès', { position: toast.POSITION.TOP_RIGHT, autoClose: 8000 })
    router.push({ name: 'demandes-administration-brouillons' })
  }).catch(err => {
    toast.error('Une erreur est servenue', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    })
  })
}

const saveAsDone = certificate => {
  currentCertificat.value.statut = 'instance'
  store.updateOne(currentCertificat.value).then(() => {
    toast.success('Les données ont été enregistrées avec succès', { position: toast.POSITION.TOP_RIGHT, autoClose: 8000 })
    router.push({ name: 'demandes-administration-instances' })
  }).catch(err => {
    toast.error('Une erreur est servenue', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    })
  })
}

const uploadFile = (file, type) => {

}

const saveFiles = (file1, file2) => {
  // save the certificat informations

  const formData1 = new FormData()
  const formData2 = new FormData()

  formData1.append('file', file1)
  formData2.append('file', file2)

  uploadStore.uploadMany({ id: currentCertificat.value._id, files: [{ file: formData1, type: 'cni' }, { file: formData2, type: 'attestation' }] }).then(() => {
    toast.success('Les données ont été enregistrées avec succès', { position: toast.POSITION.TOP_RIGHT, autoClose: 8000 })
  }).catch(err => {
    toast.error('Une erreur est servenue', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    })
  })
}

const onSubmit = () => {
  console.log('submit')
}
</script>

<template>
  <div>
    <VDialog
      v-model="isDialogueNfsReader"
      persistent
      class="v-dialog-sm"
    >
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogueNfsReader = !isDialogueNfsReader" />

      <!-- Dialog Content -->
      <VCard title="Avertissement">
        <VCardText>
          Veuillez brancher le lecteur de carte avant de continuer.
        </VCardText>

        <VCardText class="d-flex justify-end gap-3 flex-wrap">
          <VBtn
            color="secondary"
            variant="tonal"
            is-dialogue-nfs-reader
            @click="isDialogueNfsReader = false"
          >
            Annuler
          </VBtn>
          <VBtn
            :href="CNI_READER"
            @click="isDialogueNfsReader = false"
          >
            Continuer
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
    <div class="button-card-container">
      <!--
        Use this block if you want to redirect to as specific url
        <VBtn
        class="button-charge"
        href="_url_to_redirect"
        >
        Se connecter
        </VBtn>
      -->

      <VBtn class="button-charge">
        Se connecter
      </VBtn>
    </div>
    <VCard class="visible">
      <VCardText>
        <!-- 👉 stepper content -->
        <VWindow
          v-model="currentStep"
          class="disable-tab-transition"
        >
          <VWindowItem>
            <PersonnalInformation
              :current-stepper="currentStep"
              @next-step="next"
              @save="save"
            />
          </VWindowItem>

          <VWindowItem>
            <AdditionnelInformation
              :current-certificat="currentCertificat"
              @save="saveFiles"
              @uploadFile="uploadFile"
              @saveAsDone="saveAsDone"
              @previewsStep="back"
            />
          </VWindowItem>
        </VWindow>
      </VCardText>
    </VCard>
  </div>
</template>

<route lang="yaml">
meta:
  requiredAuth: true
</route>

<style lang="scss">
.checkout-stepper {
  .stepper-icon-step {
    .step-wrapper + svg {
      margin-inline: 3.5rem !important;
    }
  }
}

.visible {
  overflow: visible;
}

.v-slide-group__content {
  .cursor-pointer {
    pointer-events: none;
  }
}

.button-card-container {
  display: flex;
  justify-content: end;
  margin-block-end: 15px;

  .button-charge {
    text-transform: initial;
  }
}
</style>
