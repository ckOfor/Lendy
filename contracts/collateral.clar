;; Define constants
(define-constant err-insufficient-collateral (err u100))
(define-constant err-withdrawal-exceeds-collateral (err u101))

;; Define data maps
(define-map user-collateral principal uint)

;; Deposit collateral
(define-public (deposit-collateral (amount uint))
  (begin
    (asserts! (>= amount u1) err-insufficient-collateral)
    (map-set user-collateral tx-sender (+ (default-to u0 (map-get? user-collateral tx-sender)) amount))
    (ok true)
  )
)

;; Withdraw collateral
(define-public (withdraw-collateral (amount uint))
  (let ((current-collateral (default-to u0 (map-get? user-collateral tx-sender))))
    (begin
      (asserts! (>= current-collateral amount) err-withdrawal-exceeds-collateral)
      (map-set user-collateral tx-sender (- current-collateral amount))
      (ok true)
    )
  )
)

;; Get collateral balance
(define-read-only (get-collateral (user principal))
  (ok (default-to u0 (map-get? user-collateral user)))
)
