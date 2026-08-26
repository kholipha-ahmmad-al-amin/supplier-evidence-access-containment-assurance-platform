# Containment Assurance Architecture

## Control Model

The service manages containment actions for supplier-evidence access risks. One role submits a containment case, then separate roles plan the action, verify its execution, validate effectiveness, authorize completion, and close the record. Each accepted state change records a responsible actor, request identifier, note, and timestamp.

## Operational Safeguards

The transport, domain policy, validation, and storage layers are isolated. Listening-port validation, LAN binding, structured errors, graceful process termination, and atomic JSON replacement support predictable local operation without mutating state after a rejected request.
