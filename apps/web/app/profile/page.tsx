'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type HistoryEntry = {
  id: number
  date: string
  type: 'Deposit' | 'Withdraw' | 'Earnings'
  description: string
  amount: number
  balance: number
}

type Beneficiary = {
  id: number
  fullName: string
  relation: string
  email: string
  phone: string
}

const DELETION_KEY = 'aig_deletion_request_at'
const DAY_MS = 24 * 60 * 60 * 1000

export default function ProfilePage() {
  const [fullName, setFullName] = useState('Diana Carter')
  const [address, setAddress] = useState('AIG Street 12, Helsinki, Finland')
  const [email, setEmail] = useState('diana@aiginvest.com')
  const [phone, setPhone] = useState('+358 40 123 4567')
  const [username, setUsername] = useState('Diana')

  const [kycStatus, setKycStatus] = useState<'not-required' | 'required' | 'approved'>('required')
  const [kycReason, setKycReason] = useState('Required due to expanded wallet and transfer activity.')
  const [kycMessage, setKycMessage] = useState('')

  const [passportFileName, setPassportFileName] = useState('')
  const [idFileName, setIdFileName] = useState('')
  const [driversFileName, setDriversFileName] = useState('')
  const [documentClarityConfirmed, setDocumentClarityConfirmed] = useState(false)

  const [emailVerified, setEmailVerified] = useState(false)
  const [emailVerificationCode, setEmailVerificationCode] = useState('')
  const [emailCodeInput, setEmailCodeInput] = useState('')

  const [whatsappVerified, setWhatsappVerified] = useState(false)
  const [whatsappVerificationCode, setWhatsappVerificationCode] = useState('')
  const [whatsappCodeInput, setWhatsappCodeInput] = useState('')
  const [verificationMessage, setVerificationMessage] = useState('')

  const [networkDepthLimit, setNetworkDepthLimit] = useState<6 | 10>(10)
  const [invitationCode] = useState('AIG-USER-K4X9M2P')
  const [copiedInvite, setCopiedInvite] = useState(false)

  const [cashBalance, setCashBalance] = useState(15000)
  const [depositAmount, setDepositAmount] = useState(250)
  const [withdrawAmount, setWithdrawAmount] = useState(250)
  const [walletMessage, setWalletMessage] = useState('')

  const [history, setHistory] = useState<HistoryEntry[]>([
    { id: 1, date: '2026-07-08', type: 'Deposit', description: 'Bank transfer deposit', amount: 5000, balance: 15000 },
    { id: 2, date: '2026-07-07', type: 'Earnings', description: 'Network earnings payout', amount: 870, balance: 10000 },
    { id: 3, date: '2026-07-05', type: 'Withdraw', description: 'Withdrawal to bank account', amount: -1200, balance: 9130 },
  ])

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [securityMessage, setSecurityMessage] = useState('')

  const [deletionRequestedAt, setDeletionRequestedAt] = useState<number | null>(null)

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    { id: 1, fullName: 'Anna Carter', relation: 'Spouse', email: 'anna@example.com', phone: '+358 40 222 1111' },
    { id: 2, fullName: 'Leo Carter', relation: 'Brother', email: 'leo@example.com', phone: '+358 40 333 2222' },
  ])

  useEffect(() => {
    const stored = localStorage.getItem(DELETION_KEY)
    const parsed = stored ? Number(stored) : NaN
    if (Number.isFinite(parsed)) {
      setDeletionRequestedAt(parsed)
    }
  }, [])

  const totalNetworkEarnings = 196420
  const earningsByYear = [
    { year: '2023', amount: 42150 },
    { year: '2024', amount: 64500 },
    { year: '2025', amount: 70320 },
    { year: '2026 (YTD)', amount: 19450 },
  ]

  const deletionMeta = useMemo(() => {
    if (!deletionRequestedAt) return null
    const elapsedDays = Math.floor((Date.now() - deletionRequestedAt) / DAY_MS)
    return {
      elapsedDays,
      remainingDays: Math.max(30 - elapsedDays, 0),
      canDeactivateNow: elapsedDays >= 20,
    }
  }, [deletionRequestedAt])

  const pushHistory = (entry: Omit<HistoryEntry, 'id' | 'date' | 'balance'>) => {
    setHistory((prev) => {
      const newBalance = cashBalance + entry.amount
      const next: HistoryEntry = {
        ...entry,
        id: prev.length + 1,
        date: new Date().toISOString().slice(0, 10),
        balance: newBalance,
      }
      return [next, ...prev]
    })
  }

  const handleDeposit = () => {
    if (depositAmount <= 0 || Number.isNaN(depositAmount)) return
    setWalletMessage('')
    setCashBalance((prev) => prev + depositAmount)
    pushHistory({
      type: 'Deposit',
      amount: depositAmount,
      description: 'Manual profile deposit',
    })
  }

  const handleWithdraw = () => {
    if (withdrawAmount <= 0 || Number.isNaN(withdrawAmount)) {
      setWalletMessage('Enter a valid withdrawal amount.')
      return
    }
    if (withdrawAmount > cashBalance) {
      setWalletMessage('Withdrawal cannot exceed current cash wallet balance.')
      return
    }
    if (kycStatus !== 'approved' && withdrawAmount > 1000) {
      setWalletMessage('Without approved KYC, withdrawals above EUR 1,000 are blocked. Deposits and activities are still allowed.')
      return
    }

    setWalletMessage('')
    setCashBalance((prev) => prev - withdrawAmount)
    pushHistory({
      type: 'Withdraw',
      amount: -withdrawAmount,
      description: 'Manual profile withdrawal',
    })
  }

  const handlePasswordUpdate = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setSecurityMessage('Fill all password fields first.')
      return
    }
    if (newPassword.length < 8) {
      setSecurityMessage('New password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setSecurityMessage('New password and confirmation do not match.')
      return
    }
    setSecurityMessage('Password updated successfully.')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const requestDeletion = () => {
    const now = Date.now()
    localStorage.setItem(DELETION_KEY, String(now))
    setDeletionRequestedAt(now)
    window.dispatchEvent(new Event('aig-deletion-updated'))
  }

  const cancelDeletion = () => {
    localStorage.removeItem(DELETION_KEY)
    setDeletionRequestedAt(null)
    window.dispatchEvent(new Event('aig-deletion-updated'))
  }

  const addBeneficiary = () => {
    setBeneficiaries((prev) => [
      ...prev,
      { id: Date.now(), fullName: '', relation: '', email: '', phone: '' },
    ])
  }

  const updateBeneficiary = (id: number, key: keyof Beneficiary, value: string) => {
    setBeneficiaries((prev) => prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)))
  }

  const directInviteLink = `https://aiginvest.com/join/${invitationCode.replace('AIG-USER-', '')}`

  const copyInviteCode = async () => {
    await navigator.clipboard.writeText(invitationCode)
    setCopiedInvite(true)
    setTimeout(() => setCopiedInvite(false), 1600)
  }

  const hasAcceptedKycDocument = Boolean(passportFileName || idFileName || driversFileName)

  const sendEmailVerificationCode = () => {
    const code = String(Math.floor(100000 + Math.random() * 900000))
    setEmailVerificationCode(code)
    setVerificationMessage(`Email verification code sent to ${email}. Demo code: ${code}`)
  }

  const verifyEmailCode = () => {
    if (!emailVerificationCode || emailCodeInput !== emailVerificationCode) {
      setVerificationMessage('Email verification code is invalid.')
      return
    }
    setEmailVerified(true)
    setVerificationMessage('Email verified successfully.')
  }

  const sendWhatsappVerificationCode = () => {
    const code = String(Math.floor(100000 + Math.random() * 900000))
    setWhatsappVerificationCode(code)
    setVerificationMessage(`WhatsApp verification code sent to ${phone}. Demo code: ${code}`)
  }

  const verifyWhatsappCode = () => {
    if (!whatsappVerificationCode || whatsappCodeInput !== whatsappVerificationCode) {
      setVerificationMessage('WhatsApp verification code is invalid.')
      return
    }
    setWhatsappVerified(true)
    setVerificationMessage('Phone number verified via WhatsApp.')
  }

  const completeKyc = () => {
    if (!hasAcceptedKycDocument) {
      setKycStatus('required')
      setKycMessage('Upload at least one document: passport, ID card, or driver license.')
      return
    }
    if (!documentClarityConfirmed) {
      setKycStatus('required')
      setKycMessage('Confirm document clarity: name, face, and nationality must be clearly visible.')
      return
    }
    if (!emailVerified || !whatsappVerified) {
      setKycStatus('required')
      setKycMessage('Complete both email code verification and WhatsApp phone verification.')
      return
    }

    setKycStatus('approved')
    setKycReason('KYC approved after document and contact verification checks.')
    setKycMessage('KYC completed successfully. Full withdrawal access enabled.')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(rgba(10, 14, 20, 0.9), rgba(10, 14, 20, 0.9)), url("/images/Use%20AI%20Image%20May%2015,%202026,%2012_46_25.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: '#e5e7eb',
        padding: '24px 16px 48px'
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
          <h1 style={{ color: '#d4af37', fontSize: '30px', fontWeight: 800 }}>Profile & Account Center</h1>
          <Link href="/dashboard" style={{ color: '#c0c0c0', textDecoration: 'underline' }}>Back to Dashboard</Link>
        </div>

        <div style={{ display: 'grid', gap: '16px' }}>
          <section style={{ backgroundColor: 'rgba(17, 24, 39, 0.75)', border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: '12px', padding: '16px' }}>
            <h2 style={{ color: '#f8d57a', fontWeight: 700, marginBottom: '12px' }}>Identity, KYC, and Contact Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" style={fieldStyle} />
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={fieldStyle} />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" style={fieldStyle} />
              <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" style={fieldStyle} />
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" style={{ ...fieldStyle, gridColumn: '1 / -1' }} />
            </div>
            <div style={{ marginTop: '12px', fontSize: '13px', color: '#cbd5e1' }}>
              <strong>KYC status:</strong> {kycStatus === 'approved' ? 'Approved' : kycStatus === 'required' ? 'Required' : 'Not required yet'}
              <div>{kycReason}</div>
              <div style={{ marginTop: '10px' }}>
                <p style={{ marginBottom: '6px' }}>
                  KYC document requirement: Upload a clear passport copy, ID copy, or driver license copy where name, face, and nationality are visible.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
                  <label style={uploadLabelStyle}>
                    Passport copy
                    <input type="file" accept="image/*,.pdf" onChange={(e) => setPassportFileName(e.target.files?.[0]?.name ?? '')} style={{ marginTop: '4px' }} />
                    {passportFileName && <span style={uploadNameStyle}>{passportFileName}</span>}
                  </label>
                  <label style={uploadLabelStyle}>
                    ID copy
                    <input type="file" accept="image/*,.pdf" onChange={(e) => setIdFileName(e.target.files?.[0]?.name ?? '')} style={{ marginTop: '4px' }} />
                    {idFileName && <span style={uploadNameStyle}>{idFileName}</span>}
                  </label>
                  <label style={uploadLabelStyle}>
                    Driver license copy
                    <input type="file" accept="image/*,.pdf" onChange={(e) => setDriversFileName(e.target.files?.[0]?.name ?? '')} style={{ marginTop: '4px' }} />
                    {driversFileName && <span style={uploadNameStyle}>{driversFileName}</span>}
                  </label>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <input type="checkbox" checked={documentClarityConfirmed} onChange={(e) => setDocumentClarityConfirmed(e.target.checked)} />
                  I confirm the uploaded document is clear and shows name, face, and nationality.
                </label>
              </div>

              <div style={{ marginTop: '12px', display: 'grid', gap: '8px' }}>
                <div>
                  <p style={{ marginBottom: '4px' }}>
                    Email verification status: <strong>{emailVerified ? 'Verified' : 'Pending'}</strong>
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button onClick={sendEmailVerificationCode} style={smallButtonStyle}>Send email code</button>
                    <input value={emailCodeInput} onChange={(e) => setEmailCodeInput(e.target.value)} placeholder="Enter email code" style={{ ...fieldStyle, width: '180px' }} />
                    <button onClick={verifyEmailCode} style={smallButtonStyle}>Verify email</button>
                  </div>
                </div>

                <div>
                  <p style={{ marginBottom: '4px' }}>
                    Phone verification status (WhatsApp): <strong>{whatsappVerified ? 'Verified' : 'Pending'}</strong>
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button onClick={sendWhatsappVerificationCode} style={smallButtonStyle}>Send WhatsApp code</button>
                    <input value={whatsappCodeInput} onChange={(e) => setWhatsappCodeInput(e.target.value)} placeholder="Enter WhatsApp code" style={{ ...fieldStyle, width: '180px' }} />
                    <button onClick={verifyWhatsappCode} style={smallButtonStyle}>Verify phone</button>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button onClick={completeKyc} style={smallButtonStyle}>Complete KYC</button>
                <button onClick={() => setKycStatus('required')} style={smallButtonStyle}>Set KYC Required</button>
              </div>
              {verificationMessage && <p style={{ marginTop: '8px', color: '#93c5fd' }}>{verificationMessage}</p>}
              {kycMessage && <p style={{ marginTop: '6px', color: '#fcd34d' }}>{kycMessage}</p>}
            </div>
          </section>

          <section style={{ backgroundColor: 'rgba(17, 24, 39, 0.75)', border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: '12px', padding: '16px' }}>
            <h2 style={{ color: '#f8d57a', fontWeight: 700, marginBottom: '10px' }}>Invitation Code and Dashboard Link</h2>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <input value={invitationCode} readOnly style={{ ...fieldStyle, minWidth: '240px' }} />
              <button onClick={copyInviteCode} style={smallButtonStyle}>{copiedInvite ? 'Copied' : 'Copy code'}</button>
              <a href={directInviteLink} target="_blank" rel="noreferrer" style={{ color: '#93c5fd', textDecoration: 'underline', fontSize: '13px' }}>
                Open direct invite link
              </a>
              <Link href="/dashboard" style={{ ...smallButtonStyle, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                Go to Dashboard
              </Link>
            </div>
          </section>

          <section style={{ backgroundColor: 'rgba(17, 24, 39, 0.75)', border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: '12px', padding: '16px' }}>
            <h2 style={{ color: '#f8d57a', fontWeight: 700, marginBottom: '10px' }}>Network Earnings and Visibility Depth</h2>
            <p style={{ fontSize: '13px', marginBottom: '8px' }}>Network earnings from day 1 to now: <strong>EUR {totalNetworkEarnings.toLocaleString('en-US')}</strong></p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px' }}>
              {earningsByYear.map((entry) => (
                <div key={entry.year} style={{ backgroundColor: 'rgba(30, 41, 59, 0.65)', borderRadius: '8px', padding: '10px' }}>
                  <div style={{ fontSize: '12px', color: '#93c5fd' }}>{entry.year}</div>
                  <div style={{ fontWeight: 700 }}>EUR {entry.amount.toLocaleString('en-US')}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '10px', fontSize: '13px' }}>
              <span>Network depth shown in your account:</span>
              <select value={networkDepthLimit} onChange={(e) => setNetworkDepthLimit(Number(e.target.value) as 6 | 10)} style={{ ...fieldStyle, marginLeft: '8px', width: '150px' }}>
                <option value={6}>6 levels deep</option>
                <option value={10}>10 levels deep</option>
              </select>
              <p style={{ marginTop: '6px', color: '#94a3b8' }}>Members beyond this depth are hidden from your view.</p>
            </div>
          </section>

          <section style={{ backgroundColor: 'rgba(17, 24, 39, 0.75)', border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: '12px', padding: '16px' }}>
            <h2 style={{ color: '#f8d57a', fontWeight: 700, marginBottom: '10px' }}>Security: Username and Password</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current password" style={fieldStyle} />
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" style={fieldStyle} />
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" style={fieldStyle} />
            </div>
            <button onClick={handlePasswordUpdate} style={{ ...smallButtonStyle, marginTop: '10px' }}>Update password</button>
            {securityMessage && <p style={{ fontSize: '12px', marginTop: '6px', color: '#cbd5e1' }}>{securityMessage}</p>}
          </section>

          <section style={{ backgroundColor: 'rgba(17, 24, 39, 0.75)', border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: '12px', padding: '16px' }}>
            <h2 style={{ color: '#f8d57a', fontWeight: 700, marginBottom: '10px' }}>Cash Wallet and Account History</h2>
            <p style={{ marginBottom: '10px' }}>Cash wallet balance: <strong>EUR {cashBalance.toLocaleString('en-US')}</strong></p>
            <p style={{ marginBottom: '10px', fontSize: '12px', color: '#cbd5e1' }}>
              Policy: Without approved KYC, users can deposit and use system activities, but cannot withdraw above EUR 1,000.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
              <input type="number" value={depositAmount} onChange={(e) => setDepositAmount(Number(e.target.value))} style={{ ...fieldStyle, width: '150px' }} />
              <button onClick={handleDeposit} style={smallButtonStyle}>Deposit</button>
              <input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(Number(e.target.value))} style={{ ...fieldStyle, width: '150px' }} />
              <button onClick={handleWithdraw} style={smallButtonStyle}>Withdraw</button>
            </div>
            {walletMessage && <p style={{ marginBottom: '10px', fontSize: '12px', color: '#fca5a5' }}>{walletMessage}</p>}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)' }}>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Type</th>
                    <th style={thStyle}>Description</th>
                    <th style={thStyle}>Amount</th>
                    <th style={thStyle}>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id}>
                      <td style={tdStyle}>{item.date}</td>
                      <td style={tdStyle}>{item.type}</td>
                      <td style={tdStyle}>{item.description}</td>
                      <td style={{ ...tdStyle, color: item.amount >= 0 ? '#86efac' : '#fca5a5' }}>
                        {item.amount >= 0 ? '+' : ''}{item.amount.toLocaleString('en-US')}
                      </td>
                      <td style={tdStyle}>{item.balance.toLocaleString('en-US')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section style={{ backgroundColor: 'rgba(17, 24, 39, 0.75)', border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: '12px', padding: '16px' }}>
            <h2 style={{ color: '#f8d57a', fontWeight: 700, marginBottom: '10px' }}>Rules and Regulations Sheet</h2>
            <p style={{ fontSize: '13px', marginBottom: '8px' }}>Read your ecosystem agreements and compliance terms.</p>
            <ul style={{ fontSize: '13px', lineHeight: 1.6, color: '#cbd5e1', paddingLeft: '18px' }}>
              <li>Membership Terms and Package Responsibilities</li>
              <li>KYC and AML Requirements</li>
              <li>Wallet, Ledger, and Transaction Rules</li>
              <li>Network Earnings and Referral Policy</li>
              <li>Data Retention and Privacy Commitments</li>
            </ul>
            <div style={{ marginTop: '8px' }}>
              <a href="/AIGINVEST_CONSTITUTION_v1.0.md" target="_blank" rel="noreferrer" style={{ color: '#93c5fd', textDecoration: 'underline' }}>
                Open ecosystem agreement reference
              </a>
            </div>
          </section>

          <section style={{ backgroundColor: 'rgba(127, 29, 29, 0.35)', border: '1px solid rgba(248, 113, 113, 0.45)', borderRadius: '12px', padding: '16px' }}>
            <h2 style={{ color: '#fecaca', fontWeight: 700, marginBottom: '8px' }}>Account Deletion</h2>
            <p style={{ fontSize: '13px', color: '#fecaca' }}>
              Your account is not deleted immediately. Deletion is scheduled after a 30-day grace period to prevent mistakes and preserve required historical records (network structure, purchased goods/services, and ledger history).
            </p>
            {!deletionMeta && (
              <button onClick={requestDeletion} style={{ ...smallButtonStyle, marginTop: '10px', backgroundColor: '#fca5a5', color: '#7f1d1d' }}>
                Request deletion in 30 days
              </button>
            )}
            {deletionMeta && (
              <div style={{ marginTop: '10px', fontSize: '13px', color: '#fee2e2' }}>
                <p>Deletion requested. Remaining grace period: {deletionMeta.remainingDays} day(s).</p>
                <p>During this period every page shows “under deletion by the owner” notice with cancellation option.</p>
                {deletionMeta.canDeactivateNow && (
                  <p style={{ marginTop: '6px', color: '#fef3c7' }}>
                    Day 20 reached: account can be deactivated while historic records remain preserved.
                  </p>
                )}
                <button onClick={cancelDeletion} style={{ ...smallButtonStyle, marginTop: '8px' }}>Cancel deletion request</button>
              </div>
            )}
          </section>

          <section style={{ backgroundColor: 'rgba(17, 24, 39, 0.75)', border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: '12px', padding: '16px' }}>
            <h2 style={{ color: '#f8d57a', fontWeight: 700, marginBottom: '8px' }}>Inheritance of Your Account</h2>
            <p style={{ fontSize: '13px', marginBottom: '8px', color: '#cbd5e1' }}>
              Add two or more persons who can request inheritance processing with required documents if you can no longer access your account.
            </p>
            {beneficiaries.map((person) => (
              <div key={person.id} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '8px', marginBottom: '8px' }}>
                <input value={person.fullName} onChange={(e) => updateBeneficiary(person.id, 'fullName', e.target.value)} placeholder="Full name" style={fieldStyle} />
                <input value={person.relation} onChange={(e) => updateBeneficiary(person.id, 'relation', e.target.value)} placeholder="Relation" style={fieldStyle} />
                <input value={person.email} onChange={(e) => updateBeneficiary(person.id, 'email', e.target.value)} placeholder="Email" style={fieldStyle} />
                <input value={person.phone} onChange={(e) => updateBeneficiary(person.id, 'phone', e.target.value)} placeholder="Phone" style={fieldStyle} />
              </div>
            ))}
            <button onClick={addBeneficiary} style={smallButtonStyle}>Add inheritor</button>
            {beneficiaries.length < 2 && (
              <p style={{ marginTop: '8px', color: '#fca5a5', fontSize: '12px' }}>At least 2 inheritors are required.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

const fieldStyle: React.CSSProperties = {
  backgroundColor: 'rgba(15, 23, 42, 0.8)',
  color: '#e5e7eb',
  border: '1px solid rgba(148, 163, 184, 0.35)',
  borderRadius: '8px',
  padding: '9px 10px',
  fontSize: '13px',
}

const smallButtonStyle: React.CSSProperties = {
  backgroundColor: '#d4af37',
  color: '#111827',
  border: 'none',
  borderRadius: '8px',
  padding: '8px 12px',
  fontWeight: 700,
  fontSize: '12px',
  cursor: 'pointer',
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '8px',
  borderBottom: '1px solid rgba(148, 163, 184, 0.3)',
}

const tdStyle: React.CSSProperties = {
  padding: '8px',
  borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
  color: '#cbd5e1',
}

const uploadLabelStyle: React.CSSProperties = {
  backgroundColor: 'rgba(15, 23, 42, 0.5)',
  border: '1px dashed rgba(148, 163, 184, 0.45)',
  borderRadius: '8px',
  padding: '8px',
  fontSize: '12px',
  color: '#cbd5e1',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
}

const uploadNameStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#93c5fd',
  wordBreak: 'break-all',
}
