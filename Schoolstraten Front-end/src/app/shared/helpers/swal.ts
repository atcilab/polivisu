import Swal, { SweetAlertOptions } from "sweetalert2";

export function successToast(options: SweetAlertOptions) {
  return Swal.fire({
    toast: true,
    position: "top-right",
    timer: 2000,
    ...options
  });
}

export function errorToast(options: SweetAlertOptions) {
  return Swal.fire({
    icon: "error",
    showConfirmButton: false,
    toast: true,
    position: "top-right",
    timer: 2000,
    ...options
  });
}

export function successAlert(options: SweetAlertOptions) {
  return Swal.fire(options);
}

export function errorAlert(options: SweetAlertOptions) {
  return Swal.fire(options);
}
