<script lang="ts" setup>
import { VDataTable } from 'vuetify/labs/VDataTable'

const { historyPersonne } = defineProps([
  'historyPersonne',
])

const emit = defineEmits(['confirm', 'cancel'])

// 👉 methods
const resolveOrigineColor = (origine: string) => {
  if (origine === 'backoffice')
    return { color: 'info', text: 'Backoffice' }
  if (origine === 'web')
    return { color: 'warning', text: 'Web' }
}

const resolveStatusColor = (status: string) => {
  if (status === 'brouillon')
    return { color: 'warning', text: 'Brouillon' }

  if (status === 'instance')
    return { color: 'primary', text: 'Instance' }

  if (status === 'delivree')
    return { color: 'info', text: status }

  if (status === 'traitee')
    return { color: 'success', text: 'traitee' }

  if (status === 'rejete')
    return { color: 'error', text: 'rejetee' }
  else return { color: 'secondary', text: status }
}

const checkboxString = ref(false)
const isDialogVisible = ref(true)

const headers = [
  { title: 'UNITE', key: 'unite.fr' },
  { title: 'CNI', key: 'personne.cni' },

  { title: 'PRENOM ', key: 'personne.prenom.fr' },
  { title: 'NOM ', key: 'personne.nom.fr' },
  { title: 'DATE DEMANDE', key: 'dateDemande' },
  { title: 'Motif', key: 'motifDemande.libelle.fr' },
  { title: 'ADRESSE', key: 'adresse' },

  // { title: 'ORIGINE', key: 'origineDemande' },
  { title: 'STATUT', key: 'statut' },
]
</script>

<template>
  <VDialog
    v-model="isDialogVisible"
    width="1300"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="emit('cancel')" />

    <!-- Dialog Content -->
    <VCard title="Confirmation">
      <VCardText>
        <h4 class="mb-3">
          Historique des demandes
        </h4>
        <!-- 👉 Data Table  -->
        <VDataTable
          :headers="headers"
          :items="historyPersonne"
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
        <VCheckbox
          v-model="checkboxString"
          color="success"
          label="Je confirme qu'un pointage a été effectué"
        />
      </VCardText>

      <VDivider />

      <VCardText class="d-flex justify-end flex-wrap gap-3 pt-5">
        <VBtn
          color="secondary"
          variant="tonal"
          @click="emit('cancel')"
        >
          Annuler
        </VBtn>
        <VBtn
          color="success"
          :disabled="!checkboxString"
          @click="emit('confirm')"
        >
          Confirmer
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
