"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// import { MultiSelect } from "@/componnents/ui/multi-select";
import { useEffect, useState } from "react";
import { MultiSelect, MultiSelectContent, MultiSelectGroup, MultiSelectItem, MultiSelectTrigger, MultiSelectValue } from "../ui/multi-select";
import { useRouter } from "next/navigation";
import { CanDisableButton, SubmitButton } from "../form/Buttons";
import { assignVendorsAction } from "@/utils/actions";
import { FormModalContainer } from "../form/FormContainer";

type VendorOption = {
  label: string;
  value: string;
};

type AssignedVendor = {
  id: string;
  email: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  rfqListId: string;

  // 🔽 dropdown vendors
//   vendors: VendorOption[];

//   // already assigned
//   assignedVendors: AssignedVendor[];
};

export function AssignVendorModal({
  open,
  onClose,
  rfqListId,
//   vendors,
//   assignedVendors,
}: Props) {
  const [vendors, setVendors] = useState<VendorOption[]>([]);
  const [assignedVendors, setAssignedVendors] = useState<AssignedVendor[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      
      setLoading(true);
      try {
        const res = await fetch(
          `/api/pm/rfq-list/${rfqListId}/vendors`
        );

        const data = await res.json();

        setVendors(
            data?.vendors.map((v: any) => ({
            label: `${v.FullName} (${v.email})`,
            value: v.Id,
            }))
        );

        setAssignedVendors(
          data.assignedVendors.map((v: any) => ({
            id: v.Id,
            email: v.email,
          }))
        );

        console.log(data.assignedVendors, 'assigned');
        console.log(data.vendors, 'vendors');

      } catch (err) {
        console.error("Fetch vendors failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open, rfqListId]);

  const handleAssign = async () => {
    console.log("Assign vendors:", selectedVendors);

    if (selectedVendors.length === 0) return;

    const res = await fetch(
        `/api/pm/rfq-list/${rfqListId}/vendors`,
        {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            vendorIds: selectedVendors,
        }),
        }
    );

    const data = await res.json();

    if (!res.ok) {
        alert(data.error || "Failed to assign vendors");
        return;
    }

    // Optional: refresh assigned vendors
    setSelectedVendors([]);

    onClose();
    router.push("/rfqs/dashboard");
    // 🚧 API call next step
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg p-6 space-y-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Assign vendor to internal RFQ
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            RFQ Reference
          </DialogDescription>
        </DialogHeader>

        {/* Vendor select */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Assign from existing vendors
          </label>

          {/* <MultiSelect
          children
            values={selectedVendors}
            onValuesChange={setSelectedVendors}
          /> */}

          <MultiSelect
            values={selectedVendors}
            onValuesChange={setSelectedVendors}
            >
                <MultiSelectTrigger className="w-full">
                    <MultiSelectValue placeholder="Select vendors..." />
                </MultiSelectTrigger>

                <MultiSelectContent>
                    <MultiSelectGroup>
                    {vendors.map((vendor: any) => (
                        <MultiSelectItem
                        key={vendor.value}
                        value={vendor.value}
                        >
                        {vendor.label}
                        </MultiSelectItem>
                    ))}
                    </MultiSelectGroup>
                </MultiSelectContent>
                </MultiSelect>
        </div>

        {/* Already assigned */}
        {assignedVendors.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Already assigned vendors
            </p>

            <div className="flex flex-wrap gap-2">
              {assignedVendors.map(v => (
                <span
                  key={v.id}
                  className="rounded-full bg-muted px-3 py-1 text-sm"
                >
                  {v.email}
                </span>
              ))}
            </div>

            <p className="text-xs text-muted-foreground">
              These vendors are already assigned; assigning them again is blocked.
            </p>
          </div>
        )}

        {/* Footer */}
        {/* <DialogFooter className="flex justify-between pt-4">

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>


            <Button
              onClick={handleAssign}
              disabled={selectedVendors.length === 0}
            >
              Assign vendor
            </Button>
          </div>
        </DialogFooter> */}

        <FormModalContainer
          action={assignVendorsAction}
          onSuccess={() => onClose()}
        >
          <input type="hidden" name="rfqListId" value={rfqListId} />

          {selectedVendors.map((vendorId) => (
            <input
              key={vendorId}
              type="hidden"
              name="vendorIds"
              value={vendorId}
            />
          ))}

          <DialogFooter className="flex justify-between pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>

            <CanDisableButton size="default"
              text="Assign vendor"
              disable={selectedVendors.length === 0}
            />
          </DialogFooter>
        </FormModalContainer>
      </DialogContent>
    </Dialog>
  );
}
