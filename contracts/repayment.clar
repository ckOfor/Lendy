;; Define data maps
(define-map user-loans principal uint)
(define-map user-repayments principal uint)

;; Issue a loan
(define-public (issue-loan (amount uint))
  (begin
    (map-set user-loans tx-sender amount)
    (ok true)
  )
)

;; Repay a loan
(define-public (repay-loan (amount uint))
  (let ((current-loan (default-to u0 (map-get? user-loans tx-sender))))
    (begin
      (asserts! (>= amount current-loan) (err u101)) ;; Cannot repay more than loan amount
      (map-set user-loans tx-sender (- current-loan amount))
      (map-set user-repayments tx-sender (+ (default-to u0 (map-get? user-repayments tx-sender)) amount))
      (ok true)
    )
  )
)

;; Get remaining loan balance
(define-read-only (get-loan-balance (user principal))
  (ok (default-to u0 (map-get? user-loans user)))
)

;; Get total repayments made
(define-read-only (get-repayments (user principal))
  (ok (default-to u0 (map-get? user-repayments user)))
)
