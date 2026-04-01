"use client";

import { TreasuryAction } from "@/lib/treasury-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStatusColor } from "@/lib/treasury-types";
import { CheckCircle2, Download, Share2, Copy } from "lucide-react";
import { useState } from "react";

type PaymentReceiptProps = {
  action: TreasuryAction;
  onDismiss: () => void;
};

export function PaymentReceipt({ action, onDismiss }: PaymentReceiptProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyReceiptId = () => {
    navigator.clipboard.writeText(action.referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportReceipt = () => {
    const receiptText = `
PAYMENT RECEIPT
===============

Action ID: ${action.referenceId}
Status: ${action.status}
Type: ${action.type}
Amount: ${action.amount.toLocaleString()} π
Created: ${action.createdAt.toLocaleString()}
${action.approvedAt ? `Approved: ${action.approvedAt.toLocaleString()}\n` : ""}${action.submittedAt ? `Submitted: ${action.submittedAt.toLocaleString()}\n` : ""}
Note: ${action.note || "N/A"}

Wallet Signature: ${action.runtimeEvidence.walletSignature || "N/A"}
${action.runtimeEvidence.blockchainTxId ? `Transaction ID: ${action.runtimeEvidence.blockchainTxId}\n` : ""}
===============
Generated: ${new Date().toLocaleString()}
    `.trim();

    const blob = new Blob([receiptText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${action.referenceId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShareReceipt = () => {
    const shareText = `Payment Completed - Action Signed via Pi Wallet\n\nReference: ${action.referenceId}\nAmount: ${action.amount.toLocaleString()} π\nStatus: ${action.status}`;
    
    if (navigator.share) {
      navigator.share({
        title: "Treasury Action Receipt",
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Receipt details copied to clipboard");
    }
  };

  return (
    <Card className="border-accent bg-accent/5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0" />
            <div>
              <CardTitle className="text-lg">Payment Completed</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Action Signed via Pi Wallet
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(action.status)}>
            {action.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Receipt Details */}
        <div className="bg-card border border-border rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Action ID</p>
              <p className="text-sm font-mono text-foreground break-all">{action.referenceId}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Amount</p>
              <p className="text-sm font-bold text-foreground">{action.amount.toLocaleString()} π</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Status</p>
              <p className="text-sm font-medium text-foreground">{action.status}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Type</p>
              <p className="text-sm text-foreground">{action.type}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground font-medium">Timestamp</p>
              <p className="text-sm text-foreground">{action.createdAt.toLocaleString()}</p>
            </div>
            {action.runtimeEvidence.walletSignature && (
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground font-medium">Wallet</p>
                <p className="text-sm font-mono text-primary break-all">
                  {action.runtimeEvidence.walletSignature.substring(0, 16)}...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyReceiptId}
            className="gap-2"
          >
            <Copy className="w-4 h-4" />
            {copied ? "Copied" : "Copy ID"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportReceipt}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleShareReceipt}
            className="gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>

        {/* Action Info */}
        <div className="bg-muted/50 border border-border/50 rounded-lg p-3 space-y-2">
          <div className="flex items-start gap-2">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Used by:</strong> Pi Network users with wallet connected
            </p>
          </div>
          <div className="flex items-start gap-2">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Executed by:</strong> Pi Testnet payment execution on blockchain
            </p>
          </div>
        </div>

        {/* Dismiss Button */}
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={onDismiss}
        >
          Dismiss
        </Button>
      </CardContent>
    </Card>
  );
}
