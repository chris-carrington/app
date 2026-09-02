import { css } from 'hono/css'


export const formStyle = css`
  form {
    &.bg-white {
      .field {
        &.checkboxes {
          border: 1px solid #ced3d6;
        }

        select,
        textarea,
        input[type="text"],
        input[type="email"],
        input[type="number"] {
          color: #495057;
          border: 1px solid #ced3d6;
          &:focus {
            box-shadow: 0 0 0 0.3rem rgba(0, 123, 255, 0.25);
          }
        }

        select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='10' viewBox='0 0 16 10'%3E%3Cpath d='M1 1l7 7 7-7' stroke='%23475569' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
        }
      }

      .error-message {
        color: #ff3333;
      }
    }
    &.bg-pattern {
      .field {
        &.checkboxes {
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        select,
        textarea,
        input[type="text"],
        input[type="email"],
        input[type="number"] {
          color: var(--white);
          background-color: rgb(255 255 255 / 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          &:focus {
            box-shadow: 0 0 0 0.3rem rgba(0, 123, 255, 0.6);
          }
        }

        select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='10' viewBox='0 0 16 10'%3E%3Cpath d='M1 1l7 7 7-7' stroke='%23F9FBF9' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
        }
      }

      .error-message {
        color: rgba(255, 58, 58, 0.9);
      }

      .checkboxes {
        color: var(--white);
      }
    }

    .two {
      display: flex;
      gap: var(--space-lite);

      input {
        width: 50%;
      }
    }

    .field {
      width: 100%;
      margin-bottom: var(--space-lite);
      &.checkboxes {
        label {
          display: inline-block;
        }

        .error-message {
          margin-top: -0.9rem;
        }
      }

      label {
        display: block;
        margin-bottom: 0.54rem;
      }

      select,
      textarea,
      input[type="text"],
      input[type="email"],
      input[type="number"] {
        width: 100%;
        display: block;
        border-radius: var(--radius);
        padding: var(--space-lite);
        transition: var(--fast-transition);
        &:focus {
          outline: 0;
          border-color: transparent;
        }
        &.has-error:focus {
          box-shadow: 0 0 0 0.3rem rgba(255, 58, 58, 0.45) !important;
        }
      }

      select {
        appearance: none;
        -webkit-appearance: none;
        background-repeat: no-repeat;
        background-position: right 1.6rem center;
        padding-right: 4.4rem;
      }

      textarea {
        height: 9rem;
        resize: vertical;
      }
    }

    .error-message {
      display: none;
      font-size: 1.56rem;
      margin-top: 0.45rem;
    }
  }

  a,
  button {
    &.orange,
    &.primary,
    &.transparent {
      outline: 0;
      font-weight: 600;
      text-align: center;
      white-space: nowrap;
      text-decoration: none;
      border: 1px solid transparent;
      padding: calc(var(--space-lite) / 1.2);
      border-radius: var(--radius);
      cursor: pointer;
      transition: var(--fast-transition);
      &:disabled {
        opacity: 0.81;
        cursor: default;
      }
      &:hover {
        box-shadow: 0px 10px 9px 1px rgba(0 ,0, 0, 0.33);
        transform: translateY(-0.2rem);
      }
      &:active {
        transform: translateY(0) scale(0.98);
        box-shadow: 0px 9px 3px 0 rgba(0 ,0, 0, 0.33);
      }
    }
    &.primary {
      color: var(--white);
      background: var(--primary-gradient);
    }
    &.orange {
      color: var(--orange-text);
      background: var(--orange-gradient);
      &.big {
        border-color: rgb(255, 255, 255, 0.2);
      }
    }
    &.transparent {
      color: var(--white);
      background-color: transparent;
      border-color: rgb(255, 255, 255, 0.2);
    }
    &.wide {
      width: 100%;
    }
    &.big {
      font-size: 1.86rem;
      border-radius: calc(var(--radius) * 2);
      padding: var(--space-lite) var(--space);
    }
  }

  .checkboxes {
    border-radius: var(--radius);
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-lite);
    font-size: 1.86rem;
    margin-inline: 0; // overwrite chrome default

    .checkbox {
      display: flex;
      align-items: center;

      input,
      label {
        cursor: pointer;
      }
    
      input {
        margin: 0 calc(var(--space-lite) / 2) 0 0;
        width: 1.86rem;
        height: 1.8rem;
      }

      label {
        opacity: 0.81;
        user-select: none;
        margin: 0;
      }
    }
  }
`
