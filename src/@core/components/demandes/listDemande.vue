<script setup lang="ts">
import ModalRejete from '@/components/dialogs/ModalRejete.vue'
import { useCertificatStore } from '@/store/useCertificatStore'
import { useFileStore } from '@/store/useFileStore'
import { useDateFormat } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { VDataTable } from 'vuetify/labs/VDataTable'

const { statut, data, header, origineDemande } = defineProps([
  'statut',
  'data',
  'header',
  'origineDemande',
])

const keycloak = inject('keycloak')

const router = useRouter()
const { listCertificat } = storeToRefs(useCertificatStore())
const { updateOne, fetchAll, deleteOne, filePdf, historyCertificateByPersonne } = useCertificatStore()
const { fillPdf } = useFileStore()
const search = ref('')
const currentCertificat = ref({})
const historyPersonne = ref([])

const items = ref([
  { title: 'Consulter', icon: 'mdi-eye', type: 'voir' },
  { title: 'Modifier', icon: 'mdi-pencil', type: 'update' },
  { title: 'Supprimer', icon: 'mdi-delete', type: 'delete' },
  { title: 'Marquer comme délivrée', icon: 'mdi-share', type: 'delivre' },
  { title: 'Rejeter', icon: 'mdi-block-helper', type: 'rejete' },

  // { title: 'Historique des demandes', icon: 'mdi-history', type: 'historique' },
  { title: 'Valider', icon: 'mdi-clock', type: 'traiter' },
  { title: 'Imprimer', icon: 'mdi-printer', type: 'imprimer' },
])

const cancelOperation = () => {
  showDialogueTraite.value = false
}

const isUpgradePlanDialogVisible = ref(false)
const isUpgradePlanDialogVisibleRejete = ref(false)
const showDialogueTraite = ref(false)
const isViewDemande = ref(false)
const currentAction = ref('')
const msgBox = ref('')
const msgDescription = ref('')

// headers
let headers = [
  { title: 'CNI', key: 'personne.cni' },
  { title: 'PRENOM ', key: 'personne.prenom.fr' },
  { title: 'NOM ', key: 'personne.nom.fr' },
  { title: 'DATE DEMANDE', key: 'dateDemande' },
  { title: 'Motif', key: 'motifDemande.libelle.fr' },
  { title: 'ADRESSE', key: 'adresse' },
  { title: 'STATUT', key: 'statut' },
  { title: 'ACTIONS', key: 'actions', sortable: false },
]

// 👉 methods
const resolveOrigineColor = (origine: string) => {
  if (origine === 'backoffice')
    return { color: 'info', text: 'Backoffice' }
  if (origine === 'web')
    return { color: 'warning', text: 'Web' }
}

// 👉 methods
const resolveStatusColor = (status: string) => {
  if (status === 'brouillon')
    return { color: 'warning', text: 'Brouillon' }

  if (status === 'instance')
    return { color: 'primary', text: 'Instance' }

  if (status === 'delivree')
    return { color: 'info', text: status }

  if (status === 'traitee')
    return { color: 'success', text: 'validée' }

  if (status === 'rejete')
    return { color: 'error', text: 'rejetee' }
  else return { color: 'secondary', text: status }
}

const confirmeOperation = () => {
  currentCertificat.value.statut = 'traitee'
  currentCertificat.value.traitePar = `${keycloak.tokenParsed?.grade.abr} ${keycloak.tokenParsed?.name}`
  updateOne(currentCertificat.value)
    .then(async () => {
      await fetchAll({ statut, origineDemande })
      showDialogueTraite.value = false
      toast.success('La demande a été mise à jour avec succès', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      })
    })
    .catch(() => {
      toast.error('Une erreur est servenue', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      })
    })
}

const onClik = (type: string, item: object) => {
  switch (type) {
    case 'voir': {
      console.log('voir')

    return router.push({
        name: 'demandes-view-id',
        params: { id: item._id },
      })
  }
    case 'update': {
      console.log('update')

    return router.push({
        name: 'demandes-edit-id',
        params: { id: item._id },
      })
  }
    case 'delete': {
      currentCertificat.value = item
    currentAction.value = 'delete'
    msgBox.value = 'Avertissement'
    msgDescription.value = 'Voulez-vous vraiment supprimer cette demande ?'
    isUpgradePlanDialogVisible.value = true
    break
  }
    case 'update': {
      console.log('update')

    break
  }
    case 'pointer': {
      console.log('pointer')

    break
  }
    case 'delivre': {
      currentCertificat.value = item
    currentAction.value = 'delivre'
    msgBox.value = 'Avertissement'
    msgDescription.value
        = 'Voulez-vous vraiment marquer cette demande comme étant délivrée ?'
    isUpgradePlanDialogVisible.value = true

    break
  }
    case 'historique': {
      console.log('historique')

    break
  }
    case 'rejete': {
      currentCertificat.value = item
    currentAction.value = 'rejete'

    isUpgradePlanDialogVisibleRejete.value = true
    break
  }
    case 'traiter': {
      currentCertificat.value = item

      // fetch history
      historyCertificateByPersonne(currentCertificat.value.personne.cni).then(res => {
        historyPersonne.value = res.data
        showDialogueTraite.value = true
      })

    // currentAction.value = 'done'
    // msgBox.value = 'Confirmation'
    // msgDescription.value
    //   = 'Voulez-vous vraiment marquer cette demande comme étant traitée ?'
    // isUpgradePlanDialogVisible.value = true

    break
  }
    case 'imprimer': {
      fillPdf(item)
        .then(res => {
          const link = document.createElement('a')

        link.href = `${import.meta.env.VITE_CERTIFICAT_URL}/assets/${
          res.data.file_name
        }`
        link.download = `${import.meta.env.VITE_CERTIFICAT_URL}/assets/${
          res.data.file_name
        }`
        link.target = '_blank'
        link.click()
        console.log(res)
      })
        .catch(err => {
          console.log(err)
        toast.error('Une erreur est servenue', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
          })
      })
    break
  }

    default: {
      console.log('null')
  }
  }
}

// const onDismiss = obser => {
//   console.log(obser)
//   currentCertificat.value.statut = 'rejete'
//   currentCertificat.value.observation = obser

//   updateOne(currentCertificat.value)
//     .then(async () => {
//       await fetchAll({ statut, origineDemande })
//       toast.success('La demande a été rejeteé', {
//         position: toast.POSITION.TOP_RIGHT,
//         autoClose: 3000,
//       })
//     })
//     .catch(() => {
//       toast.error('Une erreur est servenue', {
//         position: toast.POSITION.TOP_RIGHT,
//         autoClose: 3000,
//       })
//     })
// }

const onAction = state => {
  // !SECTION
  if (currentAction.value == 'delete') {
    deleteOne(currentCertificat.value._id)
      .then(async () => {
        await fetchAll({ statut })
        toast.success('La demande a été supprimée avec succès', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        })
      })
      .catch(() => {
        toast.error('Une erreur est servenue', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        })
      })
  }
  else if (currentAction.value == 'done') {
    currentCertificat.value.statut = 'traitee'
    console.log(currentCertificat, currentCertificat.value)
    updateOne(currentCertificat.value)
      .then(async () => {
        await fetchAll({ statut, origineDemande })
        toast.success('La demande a été mise à jour avec succès', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        })
      })
      .catch(() => {
        toast.error('Une erreur est servenue', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        })
      })
  }
  else if (currentAction.value == 'delivre') {
    currentCertificat.value.statut = 'delivree'
    console.log(currentCertificat, currentCertificat.value)
    updateOne(currentCertificat.value)
      .then(async () => {
        await fetchAll({ statut, origineDemande })
        toast.success('La demande a été mise à jour avec succès', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        })
      })
      .catch(() => {
        toast.error('Une erreur est servenue', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        })
      })
  }
  else if (currentAction.value == 'rejete') {
    currentCertificat.value.statut = 'rejete'
    currentCertificat.value.observation = state

    console.log(currentCertificat, currentCertificat.value)
    updateOne(currentCertificat.value)
      .then(async () => {
        await fetchAll({ statut, origineDemande })
        toast.success('La demande a été mise à jour avec succès', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        })
      })
      .catch(() => {
        toast.error('Une erreur est servenue', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        })
      })
  }
}

watchEffect(() => {
  // 👉 - gerer instance actions here
  if (statut === 'instance') {
    items.value = items.value.filter(
      item =>
        item.type !== 'imprimer' && item.type !== 'delivre',
    )
  }
  if (statut === 'delivree') {
    items.value = items.value.filter(
      item =>
        item.type !== 'traiter'
        && item.type !== 'update'
        && item.type !== 'delete'
        && item.type !== 'delivre' && item.type !== 'rejete',
    )
  }

  // 👉 - gerer delivree actions here
  if (statut === 'traitee') {
    items.value = items.value.filter(
      item =>
        item.type !== 'traiter' && item.type !== 'update' && item.type !== 'delete' && item.type !== 'rejete',
    )
  }

  // 👉 - gerer brouillon actions here
  if (statut === 'brouillon') {
    items.value = items.value.filter(
      item =>
        item.type !== 'imprimer' && item.type !== 'traiter' && item.type !== 'delivre' && item.type !== 'rejete',
    )
  }

  if (statut === 'rejete') {
    items.value = items.value.filter(
      item =>
        item.type === 'voir')
  }
})

onMounted(() => {
  if (header)
    headers = header
  if (data)
    listCertificat.value = Array.from(data)
  else fetchAll({ statut, origineDemande })
})
</script>

<template>
  <div>
    <VCardText>
      <VRow>
        <VCol
          cols="12"
          offset-md="8"
          md="4"
        >
          <AppTextField
            v-model="search"
            density="compact"
            placeholder="Rechercher"
            append-inner-icon="tabler-search"
            single-line
            hide-details
            dense
            outlined
          />
        </VCol>
      </VRow>
    </VCardText>

    <!-- 👉 Data Table  -->
    <VDataTable
      :headers="headers"
      :items="listCertificat"
      :search="search"
      :items-per-page="5"
      :footer-props="{
        'rows-per-page-text': 'fffff',
      }"
    >
      <!-- 👉 cni here -->
      <template #item.personne?.cni="{ item }">
        <div class="d-flex align-left">
          <span>{{ `${item.raw.personne?.cni}` }}</span>
        </div>
      </template>

      <!-- 👉 nom  here  -->
      <template #item.personne?.nom="{ item }">
        <div class="d-flex align-left">
          <span>{{ `${item.raw.personne?.nom?.fr}` }}</span>
        </div>
      </template>

      <!-- 👉 prenom here  -->
      <template #item.personne?.prenom="{ item }">
        <div class="d-flex align-left">
          <span>{{ `${item.raw.personne?.prenom?.fr}` }}</span>
        </div>
      </template>

      <!-- 👉 date here -->
      <template #item.dateDemande="{ item }">
        <div class="d-flex align-left">
          <span class="text-no-wrap font-weight-medium text--primary ms-2">{{
            useDateFormat(item.raw?.dateDemande, "YYYY-MM-DD").value
          }}</span>
        </div>
      </template>
      <!-- 👉 origine here -->
      <template #item.origineDemande="{ item }">
        <VChip
          v-if="item.raw?.statut !== 'rejete'"
          :color="resolveOrigineColor(item.raw?.origineDemande).color"
          class="font-weight-medium text-uppercase"
        >
          {{ resolveOrigineColor(item.raw?.origineDemande).text }}
        </VChip>
      </template>

      <!-- Status -->
      <template #item.statut="{ item }">
        <VChip
          v-if="item.raw?.statut !== 'rejete'"
          :color="resolveStatusColor(item.raw?.statut).color"
          class="font-weight-medium text-uppercase"
        >
          {{ resolveStatusColor(item.raw?.statut).text }}
        </VChip>
        <VTooltip
          v-else-if="item.raw?.statut === 'rejete'"
          :text="item.raw?.observation"
        >
          <template #activator="{ props }">
            <VChip
              v-bind="props"
              :color="resolveStatusColor(item.raw?.statut).color"
              class="font-weight-medium text-uppercase"
            >
              {{ resolveStatusColor(item.raw?.statut).text }}
            </VChip>
          </template>
        </VTooltip>
      </template>

      <!-- Adresse -->
      <template #item.adresse="{ item }">
        <span class="ellipsis-text">
          {{ item.raw?.adresse.fr }}
        </span>
      </template>

      <!-- Delete -->
      <template #item.actions="{ item }">
        <VMenu>
          <template #activator="{ props }">
            <VBtn
              icon="mdi-dots-vertical"
              v-bind="props"
              variant="plain"
            />
          </template>

          <VList>
            <VListItem
              v-for="(iteme, i) in items"
              :key="i"
              :value="iteme"
              color="primary"
              @click="onClik(iteme.type, item.raw)"
            >
              <template #prepend>
                <VIcon :icon="iteme.icon" />
              </template>

              <VListItemTitle v-text="iteme.title" />
            </VListItem>
          </VList>
        </VMenu>
      </template>
    </VDataTable>
    <ConfirmeCertificatDialog
      v-if="showDialogueTraite"
      :history-personne="historyPersonne"
      persistent
      @confirm="confirmeOperation"
      @cancel="cancelOperation"
    />

    <ModalRejete
      v-model:is-dialog-visible="isUpgradePlanDialogVisibleRejete"
      :confirmation-question="msgDescription"
      @confirm="onAction"
    />
  </div>
</template>

<style>
.v-data-table__tr .v-data-table__td {
  text-align: start;
}

.ellipsis-text {
  display: block;
  overflow: hidden;

  /* You can also set a fixed width for the span if needed */
  inline-size: 18.75rem; /* Adjust this as needed */
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
