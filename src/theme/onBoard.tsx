import { css } from 'styled-components'

export const onBoardCSS = css`
  :root {
    // colors
    --onboard-colors-error: ${({ theme: { colors } }) => colors.error};
    --onboard-text-color: ${({ theme: { colors } }) => colors.textColor};

    // font families
    --onboard-font-family-normal: ${({ theme }) => theme.fonts.family};
    --onboard-font-family-semibold: ${({ theme }) => theme.fonts.family};
    --onboard-font-family-light: ${({ theme }) => theme.fonts.family};
    --account-select-modal-font-family-normal: ${({ theme }) => theme.fonts.family};
    --account-select-modal-font-family-light: ${({ theme }) => theme.fonts.family};

    // font sizes
    --font-size-xl: 1.6rem;
    --font-size-lg: 1.4rem;
    --font-size-md: 1.2rem;

    --onboard-font-size-3: var(--font-size-xl);
    --onboard-font-size-5: var(--font-size-xl);
    --account-select-modal-font-size-5: var(--font-size-xl);
    --onboard-font-size-6: var(--font-size-lg);
    --account-select-modal-font-size-7: var(--font-size-md);
    --account-select-modal-font-line-height-1: 1.4;

    // modal overlay
    --onboard-modal-backdrop: ${({ theme: { modal } }) => modal.overlayColor};

    // modal main
    --onboard-connect-content-width: 420px;
    --onboard-modal-border-radius: ${({ theme: { onBoard } }) => onBoard.borderRadius};
    --onboard-connect-sidebar-background: ${({ theme: { onBoard } }) =>
      onBoard.sidebarBackgroundColor};
    --onboard-main-scroll-container-background: ${({ theme: { colors } }) => colors.mainDark1};
    --onboard-connect-sidebar-border-color: ${({ theme: { onBoard } }) =>
      onBoard.sidebarBackgroundColor};
    --onboard-modal-box-shadow: none;
    --onboard-connect-sidebar-color: ${({ theme: { onBoard } }) => onBoard.color};

    // modal header
    --onboard-connect-header-background: transparent;
    --onboard-connect-header-color: ${({ theme: { onBoard } }) => onBoard.color};

    // buttons
    --onboard-wallet-button-border-radius: 12px;
    --onboard-wallet-button-background: ${({ theme: { colors } }) => colors.darkGreen};
    --onboard-wallet-button-background-hover: ${({ theme: { colors } }) =>
      colors.darkGreenDarkened};
    --onboard-wallet-button-border-color: transparent;
    --onboard-wallet-button-color: ${({ theme: { colors } }) => colors.textColor};
    --onboard-wallet-button-color-hover: ${({ theme: { colors } }) => colors.textColor};
    --onboard-wallet-app-icon-border-color: transparent;

    // progress
    --onboard-connect-sidebar-progress-color: ${({ theme: { colors } }) => colors.primary};
    --onboard-connect-sidebar-progress-background: #fff;

    // close button
    --onboard-close-button-background-color: ${({ theme: { colors } }) => colors.primary};
  }
`

export const ModalCSS = `
  .fixed .modal-overflow {
    overflow: visible;
  }

  .fixed .modal {
    background-color: transparent;
    box-shadow: 0px 51px 80px rgba(0, 0, 0, 0.17), 0px 19.6444px 25.4815px rgba(0, 0, 0, 0.103259), 0px 4.15556px 6.51852px rgba(0, 0, 0, 0.0667407);
    overflow: visible;
  }

  .fixed .modal .container {
    background-color: transparent;
    margin: 0;
    overflow: visible;
  }

  /* Sidebar */
  .fixed .modal .sidebar {
    border-radius: 0;
    display: flex;
    padding: 20px;
    width: 100%;
  }

  .fixed .modal .sidebar .inner-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    padding: 0;
  }

  .fixed .modal .sidebar > div:last-child {
    display: none !important;
  }

  /* Sidebar title */
  .fixed .modal .sidebar .subheading {
    font-weight: 700;
    font-size: 22px;
    line-height: 1.2;
    margin: 0 0 16px;
  }

  /* Sidebar description */
  .fixed .modal .sidebar .description {
    font-weight: 400;
    font-size: 12px;
    line-height: 1.6;
    margin: 0 0 32px;
  }

  .fixed .modal .sidebar .indicators {
    margin: 0;
  }

  /* Content */
  .fixed .modal .content {
    background-color: var(--onboard-main-scroll-container-background);
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
    justify-content: center;
    padding: 20px;
    width: 100%;
  }

  .fixed .modal .content .header {
    border: none;
    padding: 0;
  }

  .fixed .modal .content .button-container {
    height: 30px;
    right: 5px;
    top: 5px;
    width: 30px;
  }

  .fixed .modal .content .button-container > div {
    height: 100%;
    width: 100%;
  }

  .fixed .modal .content .button-container .close-button {
    background-color: var(--onboard-close-button-background-color)!important;
    background-image: url('data:image/svg+xml;base64, PHN2ZyB3aWR0aD0iMzEiIGhlaWdodD0iMzEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwLjA0NiIgaGVpZ2h0PSIzMC4wNDYiIHJ4PSIxNS4wMjMiIGZpbGw9IiMwMTlEOEIiLz48cGF0aCBkPSJNMjEuNTMyIDIwLjIxNGwtMTEuNy0xMS43Yy0uMjg0LS4yODQtLjgxLS4yMTktMS4xNzMuMTQ1LS4zNjQuMzY0LS40MjkuODg5LS4xNDUgMS4xNzNsMTEuNyAxMS43Yy4yODQuMjg0LjgwOS4yMTkgMS4xNzMtLjE0NXMuNDI4LS44OS4xNDUtMS4xNzN6IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTkuODMyIDIxLjUzMmwxMS43LTExLjdjLjI4NC0uMjg0LjIyLS44MS0uMTQ1LTEuMTczLS4zNjQtLjM2NC0uODg5LS40MjktMS4xNzMtLjE0NWwtMTEuNyAxMS43Yy0uMjgzLjI4NC0uMjE4LjgwOS4xNDUgMS4xNzMuMzY0LjM2NC44OS40MjkgMS4xNzMuMTQ1eiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')!important;
    height: 100%;
    width: 100%;
  }

  .fixed .modal .content .button-container .close-button > * {
    display: none!important;
  }

  .fixed .modal .content .mobile-header {
    border: none;
    gap: 0;
    height: auto;
    padding: 0;
  }

  .fixed .modal .content .mobile-header .icon-container {
    display: none;
  }

  /* Main title */
  .fixed .modal .content .header-heading {
    color: var(--onboard-text-color);
    font-size: 16px;
    font-weight: 700;
    line-height: 1.2;
    margin: 0 0 10px;
  }

  /* Mobile subtitle */
  .fixed .modal .content .mobile-subheader {
    color: var(--onboard-text-color);
    font-size: 14px;
    font-weight: 400;
    line-height: 1.2;
    margin: 0 0 15px;
  }

  /* Wallets list */
  .fixed .modal .content .wallets-container {
    display: flex;
    flex-direction: column;
    padding: 0;
    row-gap: 10px;
  }

  /* Wallet buttons (items) */
  .fixed .modal .content .wallet-button-container button.wallet-button-styling {
    background: var( --onboard-wallet-button-background, var(--onboard-white, var(--white)) );
    border-radius: var( --onboard-wallet-button-border-radius, var(--border-radius-1) );
    border: 1px solid var( --onboard-wallet-button-border-color, var(--onboard-primary-200, var(--primary-200)) );
  }

  .fixed .modal .content .wallet-button-container-inner {
    column-gap: 10px;
    display: flex;
    flex-direction: row;
    width: 100%;
  }

  /* Wallet icon */
  .fixed .modal .content .wallet-button-container-inner > div:first-child {
    align-items: center !important;
    background-color: #fff !important;
    border-radius: 8px !important;
    display: flex !important;
    height: 58px !important;
    justify-content: center !important;
    width: 58px !important;
  }

  .fixed .modal .content .wallet-button-container-inner .name {
    font-size: 14px;
    font-weight: 400;
    line-height: 1.2;
    max-width: none;
    max-height: none;
  }

  /* Info */
  .fixed .modal .content .scroll-container > .container {
    padding: 20px 0 0 0;
  }

  /* Warning info */
  .fixed .modal .content .connecting-container.warning {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    border: 1px solid #006268;
    color: #fff;
    padding: 15px;
    width: 100%;
  }

  .fixed .modal .content .connecting-container.warning .wallet-badges > .relative:first-child,
  .fixed .modal .content .connecting-container.warning .wallet-badges > .relative:last-child > div {
    border: 1px solid #006268!important;
    border-radius: 5px!important;
    color: black!important;
    height: 40px!important;
    padding: 0!important;
    width: 40px!important;
  }

  .fixed .modal .content .connecting-container.warning .wallet-badges > .relative:first-child svg,
  .fixed .modal .content .connecting-container.warning .wallet-badges > .relative:last-child > div svg {
    display: block;
    width: 25px;
    height: 25px;
  }

  .fixed .modal .content .connecting-container.warning .wallet-badges > .relative:last-child {
    margin-left: -15px;
    right: auto;
  }

  .fixed .modal .content .connecting-container.warning .rejected-cta {
    color: #fff;
    cursor: pointer;
    font-size: 12px;
    text-decoration: underline;
  }

  /* Common button */
  .fixed .modal .content .onboard-button-primary {
    align-items: center;
    background: var(--onboard-wallet-button-background);
    border-radius: 6px;
    border: none;
    color: var(--onboard-wallet-button-color);
    cursor: pointer;
    display: flex;
    font-size: 13px;
    font-weight: 400;
    height: 34px;
    justify-content: center;
    margin: 20px 0 0 0;
    padding: 0 12px;
    position: relative;
    top: 0;
    transition: background-color 250ms ease-in-out;
  }

  .notice-container > .container {
    border: 0
  }

  .notice-container > .container > *{
    font-size: var(--font-size-md);
    color: var(--onboard-text-color);
  }

  .notice-container > .container .icon{
    width: 20px;
    display: none
  }

  .icon{
    width:100%;
  }

  .notice-container > .container .link{
    font-size: var(--font-size-md);
    line-height: 1.8;
    color: var(--primary-700)
  }


  /* Tablets and above */
  @media (min-width: 768px) {
    /* Sidebar */
    .fixed .modal .sidebar {
      border-bottom-left-radius: var(--onboard-modal-border-radius);
      border-top-left-radius: var(--onboard-modal-border-radius);
      max-width: 50%;
      width: 345px;
    }

    /* Content */
    .fixed .modal .content {
      border-bottom-right-radius: var(--onboard-modal-border-radius);
      border-top-right-radius: var(--onboard-modal-border-radius);
      width: var(--onboard-connect-content-width);
    }

    /* Close Button */
    .fixed .modal .content .button-container {
      right: -12px;
      top: -12px;
    }

    /* Main title */
    .fixed .modal .content .header-heading {
      margin: 0 0 28px;
    }
  }
`
