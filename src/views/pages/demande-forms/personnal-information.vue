<script setup lang="ts">
import { VForm } from 'vuetify/components/VForm'
import type { Certificat } from '@/@core/types'
import { useCertificatStore } from '@/store/useCertificatStore'
import { useNationaliteStore } from '@/store/useNationaliteStore'
import { useProvinceStore } from '@/store/useProvinceStore'

// 👉 - Props
const props = defineProps<Props>()

// 👉 - Emits
const emit = defineEmits(['nextStep', 'save', 'back'])
const now = new Date()
const currentMonth = now.toLocaleString('default', { month: '2-digit' })
const currentYear = now.getFullYear()
const currentDay = now.getDate()

interface Props {
  currentStepper: number
  event?: string
  data?: object
}

const nationaliteStore = useNationaliteStore()
const provinceStore = useProvinceStore()
const certificatStore = useCertificatStore()

const certificat = ref<Certificat>({
  personne: {
    nom: { fr: '', ar: '' },
    prenom: { fr: '', ar: '' },
    nomPere: { fr: '', ar: '' },
    nomMere: { fr: '', ar: '' },
    nationalite: null,
    dateNaissance: null,
    provinceNaissance: null,
    communeNaissance: null,
  },
  adresse: { fr: '', ar: '' },
  dateDemande: null,
})

const transformedObject = ref<Certificat>({
  personne: {
    nom: { fr: '', ar: '' },
    prenom: { fr: '', ar: '' },
    nomPere: { fr: '', ar: '' },
    nomMere: { fr: '', ar: '' },
    nationalite: null,
    dateNaissance: null,
    provinceNaissance: null,
    communeNaissance: null,
  },
  adresse: { fr: '', ar: '' },
  dateDemande: null,
})

const provinceNaissance = ref(null)
const nationaliteList = ref([])
const motifList = ref([])

const next = async () => {
  console.log(refForm.value, await refForm.value?.validate())
  refForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      emit('nextStep', certificat.value)
  })
}

const save = () => {
  refForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      emit('save', certificat.value)
  })
}

const refForm = ref<VForm>()

const listProvinces = ref([])
const listCommunes = ref([])
const isLoading = ref(false)
const firstUpdateEvent = ref(true)
const disabledProps = ref(false)

watch(provinceNaissance, (newValue, oldValue) => {
  // affect new province
  if (!certificat.value.personne.lieuNaissance) {
    if (props.event != 'view') {
      certificat.value.personne.provinceNaissance = newValue
      isLoading.value = true
      provinceStore.fetchList({ type: 'commune', entiteMere: newValue.code }).then(res => {
        listCommunes.value = res.data
        isLoading.value = false
        if (props.event == 'update' && firstUpdateEvent.value)
          firstUpdateEvent.value = false

        else
          certificat.value.personne.communeNaissance = null
      })
    }
  }
})

onMounted(async () => {
  certificatStore.fetchMotifList().then(res => {
    motifList.value = res.data
  })
  provinceStore.fetchList({ type: 'province' }).then(res => {
    listProvinces.value = res.data
  })

  nationaliteList.value = (await nationaliteStore.fetchList()).data
})
</script>

<template>
  <div>
    <div>
      <!-- Dialog -->
      <VForm
        ref="refForm"
        @submit.prevent="() => {}"
      >
        <VRow>
          <VCol cols="12">
            <a
              href="#"
              class="text-decoration-none"
            >Demande</a>
          </VCol>
          <VCol
            class="border rounded p-5 w-full panel-container"
            cols="12"
          >
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <AppSelect
                  v-model="certificat.motifDemande"
                  :items="motifList"
                  item-title="libelle.fr"
                  label="Motif"
                  return-object
                  single-line

                  :readonly="props.event === 'view'"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
                class="relative"
              >
                <AppDateTimePicker
                  v-model="certificat.dateDemande"
                  label="Date de la demande"

                  :readonly="props.event === 'view'"
                  :config="{ dateFormat: 'Y-m-d', disable: [{ from: `${currentYear}-${currentMonth}-${currentDay + 1}`, to: `${currentYear + 10}-${currentMonth}-${currentDay}` }] }"
                />
              </VCol>
            </VRow>
          </VCol>

          <VCol cols="12">
            <a
              href="#"
              class="text-decoration-none"
            >Personne</a>
          </VCol>
          <VCol
            class="border rounded p-5 w-full panel-container"
            cols="12"
          >
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="certificat.personne.cni"
                  label="CNIE"
                  placeholder="CNIE"
                  :readonly="props.event === 'view'"

                  clearable
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppAutocomplete
                  v-model="certificat.personne.nationalite"
                  :items="nationaliteList"
                  item-title="libelle.fr"
                  return-object
                  label="Nationalité"

                  :readonly="props.event === 'view'"
                  clearable
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="certificat.personne.nom.fr"
                  label="Nom"
                  placeholder="Nom"

                  clearable
                  :readonly="props.event === 'view'"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
                class="relative"
              >
                <AppTextFieldKeyboard

                  label="الاسم العائلي"
                  :input-field="certificat.personne.nom.ar"

                  :disabled="props.event === 'view'"
                  :initval="certificat.personne.nom.ar"
                  :readonly="props.event === 'view'"
                  @onChange="(value) => { certificat.personne.nom.ar = value }"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="certificat.personne.prenom.fr"
                  label="Prénom"
                  placeholder="Prénom"

                  clearable
                  :readonly="props.event === 'view'"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
                class="relative"
              >
                <AppTextFieldKeyboard

                  label="الاسم الشخصي"
                  :input-field="certificat.personne.prenom.ar"

                  :disabled="props.event === 'view'"
                  :initval="certificat.personne.prenom.ar"
                  :readonly="props.event === 'view'"
                  @onChange="(value) => { certificat.personne.prenom.ar = value }"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="certificat.personne.nomPere.fr"
                  label="Nom du Père"
                  placeholder="Nom du Père"

                  :readonly="props.event === 'view'"

                  clearable
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
                class="relative"
              >
                <AppTextFieldKeyboard

                  label="اسم الأب"
                  :input-field="certificat.personne.nomPere.ar"

                  :readonly="props.event === 'view'"
                  :initval="certificat.personne.nomPere.ar"
                  @onChange="(value) => { certificat.personne.nomPere.ar = value }"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="certificat.personne.nomMere.fr"
                  label="Nom de la Mère"
                  placeholder="Nom de la Mère"

                  :readonly="props.event === 'view'"

                  clearable
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
                class="relative"
              >
                <AppTextFieldKeyboard

                  v-model="certificat.personne.nomMere.ar"
                  label="اسم الأم"
                  :input-field="certificat.personne.nomMere.ar"

                  :initval="certificat.personne.nomMere.ar"
                  :readonly="props.event === 'view'"
                  @onChange="(value) => { certificat.personne.nomMere.ar = value }"
                />
              </VCol>
              <template v-if="certificat.personne.lieuNaissance">
                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="certificat.personne.lieuNaissance.fr"
                    label="Lieu de naissance"
                    placeholder="Lieu de naissance"

                    :readonly="props.event === 'view'"

                    clearable
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextFieldKeyboard

                    v-model="certificat.personne.lieuNaissance.ar"
                    label="مكان الولادة"
                    :input-field="certificat.personne.lieuNaissance.ar"

                    :initval="certificat.personne.lieuNaissance.ar"
                    :readonly="props.event === 'view'"
                    @onChange="(value) => { certificat.personne.lieuNaissance.ar = value }"
                  />
                </VCol>
              </template>
              <template v-else>
                <VCol
                  cols="12"
                  md="6"
                >
                  <AppAutocomplete
                    v-model="provinceNaissance"
                    :items="listProvinces"
                    item-title="libelle.fr"
                    return-object
                    label="Province de Naissance"

                    :readonly="props.event === 'view'"

                    single-line
                    clearable
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppAutocomplete
                    v-model="certificat.personne.communeNaissance"
                    :items="listCommunes"
                    item-title="libelle.fr"
                    return-object
                    label="Commune de Naissance"

                    single-line
                    :loading="isLoading"
                    :readonly="props.event === 'view'"

                    clearable
                  />
                </VCol>
              </template>
              <VCol
                cols="12"
                md="6"
              >
                <AppDateTimePicker
                  v-model="certificat.personne.dateNaissance"
                  label="Date de Naissance"

                  :readonly="props.event === 'view'"
                />
              </VCol>
            </VRow>
          </VCol>

          <VCol
            cols="12"
            class="mt-5"
          >
            <a
              href="#"
              class="text-decoration-none"
            >Adresse</a>
          </VCol>
          <VCol
            class="border rounded p-5 w-full panel-container"
            cols="12"
          >
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="certificat.adresse.fr"
                  label="Adresse"
                  placeholder="Adresse"

                  :readonly="props.event === 'view'"

                  clearable
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
                class="relative"
              >
                <AppTextFieldKeyboard
                  label="العنوان"
                  :input-field="certificat.adresse.ar"

                  :readonly="props.event === 'view'"
                  :initval="certificat.adresse.ar"
                  @onChange="(value) => { certificat.adresse.ar = value }"
                />
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </VForm>
    </div>
  </div>
</template>

<style scoped>
.panel-container {
  border-color: rgb(var(--v-theme-primary)) !important;
}

.disabled-area {
  pointer-events: none;
}
</style>
