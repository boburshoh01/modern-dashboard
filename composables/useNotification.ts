import { notification } from 'ant-design-vue'

export const useNotification = () => {
  const success = (message: string, description?: string) => {
    notification.success({
      message,
      description,
      placement: 'topRight',
    })
  }

  const error = (message: string, description?: string) => {
    notification.error({
      message,
      description,
      placement: 'topRight',
    })
  }

  const warning = (message: string, description?: string) => {
    notification.warning({
      message,
      description,
      placement: 'topRight',
    })
  }

  const info = (message: string, description?: string) => {
    notification.info({
      message,
      description,
      placement: 'topRight',
    })
  }

  return {
    success,
    error,
    warning,
    info,
  }
}
