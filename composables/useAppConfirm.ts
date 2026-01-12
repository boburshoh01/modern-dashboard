import { Modal } from 'ant-design-vue'
import { createVNode } from 'vue'
import { ExclamationCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'
import type { ButtonProps } from 'ant-design-vue'

interface ExtendedButtonProps extends ButtonProps {
  class?: string
}

export const useAppConfirm = () => {
  const { t } = useI18n()

  const confirm = (options: {
    title?: string
    content?: string
    onOk?: () => void
    onCancel?: () => void
    type?: 'confirm' | 'danger'
    okText?: string
    cancelText?: string
  }) => {
    const isDanger = options.type === 'danger'

    const okButtonProps: ExtendedButtonProps = {
      danger: isDanger,
      class: 'rounded-lg font-bold h-10 px-6'
    }

    const cancelButtonProps: ExtendedButtonProps = {
      class: 'rounded-lg font-bold h-10 px-6'
    }

    Modal.confirm({
      title: options.title || t('common.confirmTitle', 'Are you sure?'),
      icon: createVNode(isDanger ? ExclamationCircleOutlined : QuestionCircleOutlined, {
        style: { color: isDanger ? '#f93c65' : '#4880ff' }
      }),
      content: options.content,
      okText: options.okText || (isDanger ? t('common.delete', 'Delete') : t('common.save', 'Save')),
      okButtonProps,
      cancelText: options.cancelText || t('common.cancel', 'Cancel'),
      cancelButtonProps,
      centered: true,
      onOk: options.onOk,
      onCancel: options.onCancel,
    })
  }

  return { confirm }
}
