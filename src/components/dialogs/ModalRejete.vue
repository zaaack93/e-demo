<script lang="ts" setup>
interface Props {
  isDialogVisible: boolean

}

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'confirm', value: string): string
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const observation = ref('')

const updateModelValue = (val: boolean) => {
  emit('update:isDialogVisible', val)
}

const onConfirmation = () => {
  console.log(observation.value)
  emit('confirm', observation.value)

  updateModelValue(false)
}

const onCancel = () => {
  emit('update:isDialogVisible', false)
}
</script>

<template>
  <VDialog
    :model-value="props.isDialogVisible"
    max-width="650"
    @update:model-value="updateModelValue"
  >
    <!-- Dialog Content -->
    <VCard title="Voulez-vous vraiment marquer cette demande comme étant rejetée ?'">
      <VCardText>
        <VRow>
          <VCol cols="12">
            <AppTextarea
              v-model="observation"
              label="Observation"
              placeholder="Tapez votre observation ici"
              rows="4"
            />
          </VCol>
        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn
          variant="tonal"
          color="secondary"
          @click="onCancel"
        >
          Annuler
        </VBtn>
        <VBtn
          color="error"
          @click="onConfirmation"
        >
          Rejeter
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
