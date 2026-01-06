import { message, notification } from 'ant-design-vue'

export function useNotification() {
  const showSuccess = (content: string, duration = 3) => {
    message.success(content, duration)
  }

  const showError = (content: string, duration = 3) => {
    message.error(content, duration)
  }

  const showWarning = (content: string, duration = 3) => {
    message.warning(content, duration)
  }

  const showInfo = (content: string, duration = 3) => {
    message.info(content, duration)
  }

  const showLoading = (content: string) => {
    return message.loading(content, 0)
  }

  const notify = {
    success: (title: string, description?: string) => {
      notification.success({
        message: title,
        description,
        placement: 'topRight'
      })
    },
    error: (title: string, description?: string) => {
      notification.error({
        message: title,
        description,
        placement: 'topRight'
      })
    },
    warning: (title: string, description?: string) => {
      notification.warning({
        message: title,
        description,
        placement: 'topRight'
      })
    },
    info: (title: string, description?: string) => {
      notification.info({
        message: title,
        description,
        placement: 'topRight'
      })
    }
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    notify
  }
}
