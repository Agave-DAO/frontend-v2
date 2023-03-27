import { PropsWithChildren } from 'react'
import ReactDOM from 'react-dom'

export const BaseModal: React.FC<PropsWithChildren> = ({ children }) => {
  const portalDiv = document.getElementById('modals') as HTMLElement
  return portalDiv && ReactDOM.createPortal(<>{children}</>, portalDiv)
}

export default BaseModal
