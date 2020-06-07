/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import Helmet from "react-helmet";
import { GetAppName, CleanMessage } from "../../../context/App";
import IconInput from "../../partials/IconInput";
import NavigationGroupList from "./groupItems";
import { useMutation } from "@apollo/react-hooks";
import { NEW_GROUP, GET_NAVIGATION_GROUPS } from "../../../queries/group.query";
import { toast } from "react-toastify";
import { useQuery } from "@apollo/react-hooks";
import LoadingState from "../../partials/loading";

const NavigationGroup = () => {
    const [newModel, setModel] = useState({ name: "", desc: "", icon: "" });

    const { data, loading: gLoading, refetch } = useQuery(GET_NAVIGATION_GROUPS, {
        notifyOnNetworkStatusChange: true,
        onError: (e) => toast.error(CleanMessage(e.message)),
    });

    const [createFunc, { loading }] = useMutation(NEW_GROUP, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: async (d) => {
            if (d.NewNavigationGroup) {
                toast.success(d.NewNavigationGroup.message);
                setModel({ name: "", desc: "", icon: "" });
                document.getElementById("openNew")?.click();
                await refetch();
            }
        },
    });

    return (
        <>
            <Helmet>
                <title>Navigation Group | {GetAppName()}</title>
            </Helmet>
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="content-i">
                        <div className="content-box">
                            <div className="element-wrapper">
                                <span className="element-actions">
                                    <button className="btn btn-primary" id="openNew" data-target="#NewNavigationGroupModal" data-toggle="modal" type="button">
                                        Create New
                                    </button>
                                </span>
                                <h5 className="element-header">Navigation Group</h5>
                                <div className="row justify-content-center ">
                                    <div className="col-lg-12">
                                        <div className="element-box-tp">
                                            <LoadingState loading={gLoading} />
                                            {data && <NavigationGroupList items={data.GetNavigationGroups.docs} onRemove={() => {}} />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* New Navigation Modal */}
            <div aria-hidden="true" className="modal fade" id="NewNavigationGroupModal" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Navigation Group</h5>
                            <button aria-label="Close" className="close" data-dismiss="modal" type="button">
                                <span aria-hidden="true"> ×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <LoadingState loading={loading} />
                            <form
                                onSubmit={async (event) => {
                                    event.preventDefault();
                                    await createFunc({
                                        variables: {
                                            name: newModel.name,
                                            desc: newModel.desc,
                                            icon: newModel.icon,
                                        },
                                    });
                                }}
                            >
                                <div className="row">
                                    <div className="col-12">
                                        <IconInput
                                            initVal={newModel.name}
                                            placeholder="Enter name"
                                            label="Name"
                                            icon="os-icon-phone"
                                            required={true}
                                            type="text"
                                            onChange={(name: string) => setModel({ ...newModel, name })}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group">
                                            <label> Description </label>
                                            <textarea
                                                value={newModel.desc}
                                                onChange={({ currentTarget: { value } }) => setModel({ ...newModel, desc: value })}
                                                className="form-control"
                                                placeholder="Enter description"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                                <button className="btn btn-primary" type="submit">
                                    Save New
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NavigationGroup;
