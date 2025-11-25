import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { GetApiCall } from "../../../api/default/GetApi";
import { Api } from "../../../api/apiurl";
import PackageCard from "../../../ui/cards/PackageCard";

const Leads = () => {
  const token = useSelector((state) => state.admin.adminData?.adminAccessToken);
  const { id } = useParams();

  const [brandPackage, setBrandPackage] = useState(null);

  useEffect(() => {
    if (!id || !token) return;

    (async () => {
      try {
        const res = await GetApiCall(
          `${Api.admin.brand.getBrandByID}/${id}`,
          token,
          { paymentHistory: true }
        );

       

        setBrandPackage(res?.data?.data || null);
      } catch (error) {
        console.error("Error fetching brand:", error);
      }
    })();
  }, [id, token]);

  if (!brandPackage) return <p>Loading...</p>;
  

  return (
    <div style={{ padding: "20px" }}>
      <h3>Packages</h3>

      <div
        style={{
          display: "flex",
          gap: "15px",
          overflowX: "auto",
          paddingBottom: "10px",
          whiteSpace: "nowrap",
        }}
      >
        {/* Active package first */}
        {brandPackage.activePackage && (
          <div style={{ minWidth: "250px" }}>
            <PackageCard 
              data={brandPackage.activePackage}
              background="#08612cff"
              color="white"
            />
          </div>
        )}

        {/* Old packages next */}
        {brandPackage?.oldPackageHistory && brandPackage?.oldPackageHistory.length > 0 &&(
          brandPackage.oldPackageHistory?.map((pkg, i) => (
          <div key={i} style={{ minWidth: "250px" }}>
            <PackageCard data={pkg} />
          </div>
        ))
        )
          
        }
      </div>
    </div>
  );
};

export default Leads;
