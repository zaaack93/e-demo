<script setup lang="ts">
import { VuePDF, usePDF } from '@tato30/vue-pdf'
import { onMounted, ref } from 'vue'
import { VForm } from 'vuetify/components/VForm'
import { VDataTable } from 'vuetify/labs/VDataTable'
import { fileSize, requiredValidator } from '@validators'
import { useUploadFileStore } from '@/store/useUploadFileStore'
import type { Certificat } from '@/@core/types'

const props = defineProps<Props>()
const emit = defineEmits(['saveCertificat', 'previewsStep', 'saveAsDone'])
const uploadStore = useUploadFileStore()
interface Props {
  currentCertificat: Certificat
}
const showDialogPdf = ref(false)
let obj = null

const showDialog = link => {
  obj = usePDF(`${import.meta.env.VITE_CERTIFICAT_URL}/assets/${link}`).pdf
  showDialogPdf.value = true
}

const refForm = ref<VForm>()
const file1 = ref(null)
const file2 = ref(null)
const fileType = ref('')

const selectedFile1 = event => {
  file1.value = event.target.files[0]
}

const context = ref('')

const replaceItem = file => {
  context.value = 'replace'
  isDialogVisible.value = true
  fileType.value = file.type
  checkAvailibality()
}

const capitalizeFLetter = str => {
  return str[0].toUpperCase()
        + str.slice(1)
}

const replaceFile = () => {
  refForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      const formData1 = new FormData()

      formData1.append('file', file1.value)
      uploadStore.replace({ file: formData1, type: fileType.value }, props.currentCertificat._id).then(res => {
        props.currentCertificat.documents.forEach((document, i) => {
          if (document.type == fileType.value)
            props.currentCertificat.documents[i] = res.data
        })
        isDialogVisible.value = false
      })
    }
  })
}

const uploadFiles = () => {
  refForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      const formData1 = new FormData()

      formData1.append('file', file1.value)
      uploadStore.upload({ file: formData1, type: fileType.value }, props.currentCertificat._id).then(res => {
        props.currentCertificat.documents.push(res.data)
        isDialogVisible.value = false
      })
    }
  })
}

const previewStep = () => {
  emit('previewsStep')
}

const refFormSend = ref<VForm>()
const personne = ref({ nom_ar: '', prenom_ar: '' })

const headers = [
  { title: 'NOM du fichier', key: 'originalName' },
  { title: 'TYPE', key: 'type' },
  { title: 'Taille du fichier', key: 'fileSize' },
  { title: 'ACTIONS', key: 'actions', sortable: false },
]

onMounted(async () => {
  checkAvailibality()
})

const isDialogVisible = ref(false)
const data = ref([{}])
const items = ['cni', 'attestation']
const itemsToShow = ref([])

const triggerAddFile = () => {
  fileType.value = ''
  context.value = 'add'
  isDialogVisible.value = true
  checkAvailibality()
}

const checkAvailibality = () => {
  itemsToShow.value = items.filter(item => {
    return !props.currentCertificat.documents.filter(doc => (doc.type == item)).length
  })
}
</script>

<template>
  <div>
    <VAlert
      v-if="props.currentCertificat.documents.length < 2"
      variant="tonal"
      color="warning"
      class="mb-4"
    >
      Rappel : Vous devez enregistrer la copie des deux pièces justifictives pour pouvoir créer la demande.
    </VAlert>
    <VDialog
      v-model="showDialogPdf"
      width="auto"
    >
      <VCard>
        <!-- 👉 Title -->
        <VCardItem class="text-center" />

        <VCardText>
          <VRow>
            <!-- 👉 PDF HERE -->
            <VuePDF
              v-if="showDialogPdf"
              :pdf="obj"
              :watermark-text="$keycloak.tokenParsed?.name"
            />
          </VRow>
        </VCardText>
      </VCard>
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="showDialogPdf = false" />
    </VDialog>
    <VDialog
      v-model="isDialogVisible"
      max-width="600"
      :width="$vuetify.display.smAndDown ? 'auto' : 580"
    >
      <DialogCloseBtn @click="isDialogVisible = false" />
      <VCard>
        <!-- 👉 Title -->
        <VCardItem class="text-center" />

        <VCardText>
          <VForm
            ref="refForm"
            @submit.prevent="() => {}"
          >
            <VRow>
              <VCol cols="12">
                <VFileInput
                  accept=".pdf"
                  show-size

                  label="Choisissez un fichier"
                  :rules="[requiredValidator, fileSize]"
                  @change="selectedFile1($event)"
                />
              </VCol>
              <VCol cols="12">
                <AppSelect
                  v-model="fileType"
                  :items="itemsToShow"
                  label="Type du document"
                  :rules="[requiredValidator]"
                  :disabled="context == 'replace'"
                >
                  <template #item="{ props, item }">
                    <VListItem
                      v-bind="props"
                      :title="capitalizeFLetter(item.raw)"
                    />
                  </template>
                </appselect>
              </VCol>
              <VCol cols="12">
                <VBtn
                  v-if="context == 'add'"
                  type="submit"
                  @click="uploadFiles"
                >
                  Enregistrer
                </VBtn>
                <VBtn
                  v-if="context == 'replace'"
                  type="submit"
                  @click="replaceFile"
                >
                  Remplacer
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VDialog>
    <VBtn
      :disabled="props.currentCertificat.documents.length >= 2"
      class="mb-2"
      @click="triggerAddFile"
    >
      Ajouter un fichier
    </VBtn>
    <VDataTable
      :headers="headers"
      :items="props.currentCertificat.documents"
      class="hide-footer"
    >
      <template #item.type="{ item }">
        <span>{{ capitalizeFLetter(item.raw.type) }}</span>
      </template>
      <!-- Actions -->
      <template #item.actions="{ item }">
        <div class="d-flex gap-1">
          <IconBtn @click="showDialog(item.raw.generatedName)">
            <VIcon icon="mdi-eye" />
          </IconBtn>
          <IconBtn @click="replaceItem(item.raw)">
            <VIcon icon="mdi-refresh-circle" />
          </IconBtn>
        </div>
      </template>
    </VDataTable>

    <VCol class="mt-5">
      <VBtn
        class="float-left"
        color="secondary"
        @click="previewStep"
      >
        Précédent
      </VBtn>
      <VBtn
        class="float-right"
        color="warning"
        :disabled="props.currentCertificat.documents.length < 2"
        @click="emit('saveAsDone')"
      >
        Enregistrer
      </VBtn>
    </VCol>
  </div>
</template>

<style>
.hide-footer .v-data-table-footer {
  display: none;
}

.v-field__field {
  text-transform: capitalize;
}

/* .v-select--active-menu .v-select--single {
  background-color: red;
} */
</style>
